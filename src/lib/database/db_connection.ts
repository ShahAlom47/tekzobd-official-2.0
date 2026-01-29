
import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri: string = process.env.MONGODB_URI as string;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise!;
} else {

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  clientPromise = client.connect();
}

const checkConnection = async (): Promise<void> => {

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db(); // You can specify your database name here if needed
    await db.command({ ping: 1 }); // Send a ping to the server to check the connection
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

// Call the checkConnection function to test the connection
checkConnection();

export default clientPromise;