import 'dotenv/config';
import { connect } from "mongoose";
// Database configuration function to connect to MongoDB
// It checks if the MONGODB_CONNECTION_URI is defined and attempts to connect to the database
// If the connection fails, it logs the error and exits the process
const { MONGODB_CONNECTION_URI } = process.env;
const databaseConfiguration = async () => {
    if (!MONGODB_CONNECTION_URI) {
        console.log("MONGODB_CONNECTION_URI is undefined", MONGODB_CONNECTION_URI);
        return;
    }
    try {
        await connect(MONGODB_CONNECTION_URI);
        console.log("MongoDB connected to the backend successfully!");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("MongoDB connection has failed!", error);
        }
        process.exit(1);
    }
}

export default databaseConfiguration;