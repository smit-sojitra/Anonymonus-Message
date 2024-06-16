import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log("Connection already established")
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || '' ,{})
        console.log('db',db );
        connection.isConnected = db.connections[0].readyState;
        console.log("Connection established")
    } catch (error) {
        console.log(`Error connecting to database: ${error}`)
        process.exit(1)
    }
}
export default dbConnect;

