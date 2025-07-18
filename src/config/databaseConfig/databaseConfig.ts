import 'dotenv/config';
import { connect } from "mongoose";
const MONGODB_URL = process.env.MONGODB_CONNECTION_URI as string;
const databaseConfiguration = async () => {
    if (!MONGODB_URL) {
        console.log("MONGODB_URL is undefined", MONGODB_URL);
        return;
    }
    try {
        await connect(MONGODB_URL);
        console.log("MongoDB connected to the backend successfully!");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("MongoDB connection has failed!", error);
        }
        process.exit(1);
    }
}

export default databaseConfiguration;