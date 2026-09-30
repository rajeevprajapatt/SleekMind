import PasswordOtp from '../models/passwordOtp.js';
import User from '../models/user.js';
import { sendMail } from '../services/mailService.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export const sendOtp = async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!email) return res.status(400).json({ msg: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'No user found with this email' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await PasswordOtp.hashOtp(otp);

    await PasswordOtp.findOneAndUpdate(
      { email },
      { email, otp: hashedOtp, createdAt: new Date(), verifiedAt: null },
      { upsert: true, setDefaultsOnInsert: true }
    );

    await sendMail({
      email,
      emailSubject: 'Your password reset OTP',
      mailBody: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SleekReview - Password Reset</title>
    <!-- A small style block for email client resets that cannot be inlined -->
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333;">

    <!-- Wrapper -->
    <div style="width: 100%; background-color: #f4f7f9; padding: 40px 15px; box-sizing: border-box;">
        
        <!-- Container -->
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            
            <!-- Brand Header: Left Text, Right Logo -->
            <div style="background-color: #111827; padding: 25px 30px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="left" valign="middle">
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">
                                Sleek<span style="color: #3b82f6;">Review</span>
                            </h1>
                        </td>
                        <td align="right" valign="middle">
                            <!-- PASTE YOUR LOGO URL HERE -->
                            <img src="https://cdn.postimage.me/2026/08/26/brain-circuit-1.png" alt="SleekReview Logo" width="80" style="display: block; max-width: 80px; height: auto; border: 0;" />
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Email Body -->
            <div style="padding: 40px 30px; text-align: center;">
                <!-- <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 22px; font-weight: 600;">
                    Password Assistance
                </h2> -->
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 10px 0; text-align: left;">
                    Hi there,
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0; text-align: left;">
                    We received a request to reset the password for your SleekReview account. Enter the following One-Time Password (OTP) to securely complete this process:
                </p>
                
                <!-- The OTP Box -->
                <div style="margin: 30px 0;">
                    <div style="display: inline-block; background-color: #f3f4f6; border: 1px dashed #d1d5db; padding: 16px 32px; border-radius: 6px; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1d4ed8;">
                        ${otp}
                    </div> 
                </div>

                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0; text-align: left;">
                    This code is valid for the next <strong style="color: #111827;">10 minutes</strong>. If you are having issues, please try requesting a new code from the website.
                </p>

                <!-- Security Note -->
                <div style="font-size: 14px; line-height: 1.5; color: #6b7280; background-color: #fdfbf7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 30px 0 0 0; text-align: left; border-radius: 4px;">
                    <strong style="color: #4b5563;">Security Tip:</strong> SleekReview takes your account security seriously. We will never email you to ask for your password or credit card details. Never share this OTP with anyone. If you didn't request a password reset, you can safely ignore this email.
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px; text-align: center; font-size: 13px; line-height: 1.5; color: #9ca3af; border-top: 1px solid #f3f4f6;">
                <p style="margin: 0 0 10px 0;">
                    &copy; 2026 SleekReview. All rights reserved.
                </p>
                <p style="margin: 0;">
                    Need help? Contact our <a href="mailto:support@sleekreview.com" style="color: #3b82f6; text-decoration: none;">Support Team</a>.
                </p>
            </div>

        </div>
    </div>
</body>
</html>
  `,
    });

    return res.status(200).json({ msg: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ msg: 'Unable to send OTP' });
  }
};

export const verifyOtp = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || '').trim();

  if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP are required' });

  try {
    const passwordOtp = await PasswordOtp.findOne({ email });
    if (!passwordOtp || Date.now() - passwordOtp.createdAt.getTime() > 60 * 1000) {
      return res.status(400).json({ msg: 'OTP is invalid or expired' });
    }

    if (!(await passwordOtp.isValidOtp(otp))) {
      return res.status(400).json({ msg: 'OTP is incorrect' });
    }

    passwordOtp.verifiedAt = new Date();
    await passwordOtp.save();
    return res.status(200).json({ msg: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ msg: 'Unable to verify OTP' });
  }
};

export const updatePassword = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });
  if (password.length < 8) return res.status(400).json({ msg: 'Password must be at least 8 characters' });

  try {
    const passwordOtp = await PasswordOtp.findOne({ email });
    const verificationAge = passwordOtp?.verifiedAt
      ? Date.now() - passwordOtp.verifiedAt.getTime()
      : Infinity;

    if (!passwordOtp || !passwordOtp.verifiedAt || verificationAge > 60 * 1000) {
      return res.status(400).json({ msg: 'Please verify the OTP before resetting your password' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'No user found with this email' });

    user.password = await User.hashPassword(password);
    await user.save();
    await PasswordOtp.deleteOne({ _id: passwordOtp._id });

    return res.status(200).json({ msg: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ msg: 'Unable to update password' });
  }
};
