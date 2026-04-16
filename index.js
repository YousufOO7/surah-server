const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());

//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6mmiv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const allSurahCollection = client.db("surah").collection("surahList");

    app.get("/surah-list", async (req, res) => {
      const result = await allSurahCollection.find().toArray();
      res.send(result);
    });

    app.get("/surah-list/:id", async (req, res) => {
      try {
        const surahId = parseInt(req.params.id);

        const data = await allSurahCollection.findOne();

        if (!data) {
          return res.status(404).send({ message: "No data found" });
        }

        const surah = data.chapters[surahId.toString()];

        if (!surah) {
          return res
            .status(404)
            .send({ message: `Surah with id ${surahId} not found` });
        }

        const response = {
          ...surah,
          global_stats: {
            total_surahs: data.total_surahs,
            total_verses: data.total_verses,
            total_meccan_surahs: data.total_meccan_surahs,
            total_medinan_surahs: data.total_medinan_surahs,
          },
        };

        res.send(response);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("surah  is on");
});

app.listen(port, () => {
  console.log(`surah  is on: ${port}`);
});
