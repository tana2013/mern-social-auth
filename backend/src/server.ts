import app from "./app.js"; // Note the explicit .js extension for native ESM
import { connectDB } from "./config/db.js";
import dns from "node:dns";
import dotenv from "dotenv";

// 1. Initialize environment variables
dotenv.config();

// 2. Optimize internal network routing speeds for modern Node runtime
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const port: number = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
    try {
        // 3. Initialize the Mongoose connection pool
        await connectDB();

        // 4. Fire up the Express network listener
        app.listen(port, () => {
            console.log(`🚀 [AlphaMall Server Running]: Listening safely on Port: ${port} ^^`);
        });
    } catch (error) {
        console.error("❌ Fatal initialization exception during startup lifecycle:", error);
        process.exit(1);
    }
};

startServer();