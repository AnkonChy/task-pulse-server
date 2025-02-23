require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ri84s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("task-pulse").collection("users");
    const taskCollection = client.db("task-pulse").collection("tasks");

    //add user
    app.post("/users", async (req, res) => {
      const user = req.body;
      //insert email if user doesn't exists:
      //you can do this many ways(1. email uniques, 2.upsert, 3.simple checking)
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User Already Exists", insertedId: null });
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //add task
    app.post("/tasks", async (req, res) => {
      const data = req.body;
      const result = await taskCollection.insertOne(data);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`TaskPulse is running on port ${port}`);
});
