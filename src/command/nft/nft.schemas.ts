import { Schema } from 'mongoose';

export interface Opensea extends Document {
    name: string[]
    link: string;
}

export const OpenseaSchema = new Schema<Opensea>(
    {
        name: [String],
        link: String,
    },
    {
        versionKey: false,
    },
);
