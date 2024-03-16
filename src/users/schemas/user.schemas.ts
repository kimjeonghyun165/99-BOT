// src/modules/users/schemas/user.schema.ts

import { Schema } from 'mongoose';

export interface Count {
    day: number;
    month: number;
    allDays: number;
}

export interface User {
    save: any;
    name: string[];
    serialNum: string;
    count: Count;
    role: string;
    memo: string[];
}

export const UserSchema = new Schema<User>(
    {
        name: [String],
        serialNum: String,
        count: {
            day: Number,
            month: Number,
            allDays: Number,
        },
        role: String,
    },
    {
        versionKey: false,
    },
);
