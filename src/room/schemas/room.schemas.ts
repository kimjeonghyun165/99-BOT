// src/modules/rooms/schemas/room.schema.ts

import { Schema, Document, Types } from 'mongoose';

export interface Alarm {
    roomInfo: boolean;
    coinNess: boolean;
    superWalk: boolean;
}

export interface Room extends Document {
    date: string;
    name: string;
    serialNum: string;
    users: Types.ObjectId[]
    alarm: Alarm;
    premium: boolean;
}

export const RoomSchema = new Schema<Room>(
    {
        date: String,
        name: String,
        serialNum: String,
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }], // User 모델과 연결
        alarm: {},
        premium: Boolean
    },
    { versionKey: false },
);
