import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number;
};

const connection: connectionObject = {};

async function connectToDB(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to Database");
        return;
    }

    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URI || ""
        );

        //Console logging to see the what it has
        // console.log(connectionInstance);        
        connection.isConnected = connectionInstance.connections[0].readyState;
        
        console.log("Database connection successfull !! :)");
    } catch (error) {
        console.log("Database connection failed ", error);
        process.exit(1);
    }
}

export default connectToDB;
