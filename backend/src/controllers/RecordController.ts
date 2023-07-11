import { Request, Response } from "express";
import RecordModel from "../models/RecordModel";
import { IRecord } from "../interfaces/IRecord";
import formatDateThai from "../utils/formatDateThai";

export async function recordStartEndTime(req: Request, res: Response) {
    try {
        const { carId, id }: { carId?: string, id?: string } = req.query;

        if (!carId) {
            throw new Error("Car ID is required");
        }
        if (!id) {
            const currentDate = new Date();
            const record: IRecord | null = new RecordModel({
                carId,
                startTime: formatDateThai(currentDate),
            });
            const savedRecord = await record.save();
            return res.status(201).json({ id: savedRecord._id });
        }
        const existingRecord: IRecord | null = await RecordModel.findById(id);
        if (!existingRecord) {
            throw new Error("Record not found");
        }

        if (existingRecord.endTime) {
            return res.status(400).json({ message: "Record already has an endTime" });
        }

        const currentDate = new Date();
        const updateRecord: IRecord | null = await RecordModel.findByIdAndUpdate(
            id,
            { endTime: formatDateThai(currentDate) }
        );
        if (updateRecord) {
            return res.status(201).json('Success this record');
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export async function getRecordById(req: Request, res: Response) {
    try {
        const { carId }: { carId?: string } = req.params;

        const records = (await RecordModel.find({ carId })).reverse();
        if (!records) {
            throw new Error("Record not found");
        }
        return res.status(200).json(records);
    } catch (error) {
        return res.status(500).json({ error });
    }
}