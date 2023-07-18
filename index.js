const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m26mvwz.mongodb.net/?retryWrites=true&w=majority`;

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

    const toysCollection = client.db("toyMarketPlace").collection("toys");
    const myToysCollection = client.db("toyMarketPlace").collection("myToys");

    // all toys
    app.get("/toys", async (req, res) => {
      const result = await toysCollection.find({}).toArray();
      res.send(result);
    });

    // single toy
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    // add a toy
    app.post("/myToys", async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const result = await myToysCollection.insertOne(toy);
      res.send(result);
    });

    // my toys
    // app.get("/myToys", async (req, res) => {
    //   const result = await myToysCollection.find({}).toArray();
    //   res.send(result);
    // });
    app.get("/myToys/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const result = await myToysCollection
        .find({ seller_email: email })
        .toArray();
      res.send(result);
    });

    // mt toys update
    app.put("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: data,
      };
      const result = await myToysCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // my toys delete
    app.delete("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myToysCollection.deleteOne(query);
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
  res.send("server running");
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
