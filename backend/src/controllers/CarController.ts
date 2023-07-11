import { Request, Response } from "express";
import ArduinoModel from "../models/CarModel";
import { ICar } from "../interfaces/ICar";

export async function createCar(req: Request, res: Response) {
    try {
        const car: ICar = new ArduinoModel();
        const savedCar = await car.save();
        return res.status(201).json({ _id: savedCar._id });
    } catch (error) {
        return res.status(500).json(error);
    }
}

export async function getCarById(req: Request, res: Response) {
    try {
        const { id }: { id?: string } = req.params;
        const car = await ArduinoModel.findById(id);
        if (!car) {
            return res.status(404).json('Arduino device not found');
        }
        return res.status(200).json({
            frontLight: car.frontLight,
            backLight: car.backLight,
            leftLight: car.leftLight,
            rightLight: car.rightLight,
            isStart: car.isStart,
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

export async function getBatteryAndMapCarById(req: Request, res: Response) {
    try {
        const { id }: { id?: string } = req.params;
        const car = await ArduinoModel.findById(id);
        if (!car) {
            return res.status(404).json('Arduino device not found');
        }
        return res.status(200).json({
            battery: car.battery,
            latitude: car.latitude,
            longitude: car.longitude,
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

export async function updateCarById(req: Request, res: Response) {
    try {
        const { id }: { id?: string } = req.params;
        const update: Partial<ICar> = req.body;
        const updatedCar = await ArduinoModel.findByIdAndUpdate(id, update);
        if (!updatedCar) {
            return res.status(404).json('Car device not found');
        }
        return res.status(201).json('Update success');
    } catch (error) {
        return res.status(500).json(error);
    }
}

export async function updateBatteryAndMapCarById(req: Request, res: Response) {
    try {
        const { id }: { id?: string } = req.params;
        const update: Partial<ICar> = req.body;

        const updatedCar = await ArduinoModel.findByIdAndUpdate(id, update);
        if (!updatedCar) {
            return res.status(404).json('Car device not found');
        }
        return res.status(201).json('Update success');
    } catch (error) {
        return res.status(500).json(error);
    }
}