import { Router } from 'express';
import { createCar, getCarById, getBatteryAndMapCarById, updateCarById, updateBatteryAndMapCarById } from '../controllers/CarController';

const router = Router();

router.get('/register', createCar);
router.get('/getcar/:id', getCarById);
router.get('/getbatteryandmapcar/:id', getBatteryAndMapCarById);
router.put('/update/:id', updateCarById);
router.put('/updatebatteryandmapcar/:id', updateBatteryAndMapCarById);

export default router;