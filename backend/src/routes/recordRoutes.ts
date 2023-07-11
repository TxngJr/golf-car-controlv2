import { Router } from 'express';
import { recordStartEndTime, getRecordById } from '../controllers/RecordController';

const router = Router();

// /create?carId=34896724895827342356&id=347689347568923454356
router.get('/create/', recordStartEndTime);
router.get('/getrecords/:carId', getRecordById);

export default router;