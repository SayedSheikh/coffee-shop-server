require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mycpbjh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffees");

    app.get("/coffees", async (req, res) => {
      const result = await coffeeCollection.find().toArray();

      res.send(result);
    });

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.post("/coffees", async (req, res) => {
      const value = req.body;
      // console.log(value);

      const result = await coffeeCollection.insertOne(value);

      res.send(result);
    });

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/coffees/:id", async (req, res) => {
      const value = req.body;
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };
      const updatedValue = {
        $set: value,
      };

      const option = {
        upsert: true,
      };

      const result = await coffeeCollection.updateOne(
        query,
        updatedValue,
        option
      );

      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hii I am Coffee shop");
});

app.listen(port, () => {
  console.log("listening from Cofeeshop");
});
