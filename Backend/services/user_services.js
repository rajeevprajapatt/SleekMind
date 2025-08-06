import User from "../models/user.js"

export const createUser = async ({ fullName, email, password }) => {
    fullName = fullName.toLowerCase().split(' ').filter(word => word.length > 0).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    if (fullName.length === 0) {
        fullName = "User@" + Math.floor(Math.random() * 1000);
    }
    if (!email || !password) {
        throw new error("email and password are required");
    }

    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword
    });

    return user;
}

export const getAllUsers = async ({ userId }) => {
    const users = await User.find({
        _id: {
            $ne: userId,
            $ne: {
                _id: "000000000000000000000001"
            }
        }
    });
    return users;
}