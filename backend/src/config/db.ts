import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
dotenv.config();

const connectionType: string = process.env.STATE || "";
const isOffline: boolean = process.env.STATE === "offline";
const mode: string = process.env.NODE_ENV || "development";
const dbUri: string = isOffline
    ? (process.env.LOCAL_MONGODB_URI || "")
    : (process.env.MONGODB_URI || "")
    ;

let mongod: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
    if (process.env.NODE_ENV === "test") {
        mongod = await MongoMemoryServer.create();
        const uri: string = mongod.getUri();
        await mongoose.connect(uri);
        return;
    } else {
        if (!dbUri) {
            console.error('CRITICAL: MONGO_URI environment variable is missing.');
            process.exit(1);
        }
        try {
            const connect = await mongoose.connect(dbUri);
            console.log(`Success Connect ${connectionType} To MongoDB On Host: ${connect.connection.host} in ${mode} Mode ^^`);
        } catch (error) {
            console.log(`Database Connection failed: ${(error as Error).message}!`);
            process.exit(1);
        }
    }
}
export const closeDB = async (): Promise<void> => {
    await mongoose.disconnect();
    if (mongod) {
        await mongod.stop();
    }
}
export const clearDB = async (): Promise<void> => {
    if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB is Not Connected!");
    }

    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];

        // Add this check to satisfy TypeScript's strict mode
        if (collection) {
            try {
                await collection.deleteMany({});
            } catch (error) {
                console.warn(`Warning clearing collection ${key}: ${(error as Error).message}`);
            }
        }
    }
}