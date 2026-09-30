import express from 'express';

import * as updateController from '../controllers/update_controller.js'


const router = express.Router();

router.post('/sendOtp', updateController.sendOtp);
router.post('/verifyOtp', updateController.verifyOtp);
router.patch('/updatePassword', updateController.updatePassword);

export default router;