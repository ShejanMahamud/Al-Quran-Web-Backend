const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 4000;
const uri = process.env.MONGO_URI;

//middlewares
app.use(cors());
app.use(express.json());

//mongo client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();

    const bookmarkSurahCollection = client.db('al-quran-db').collection('bookmarkSurah');

    app.post('/bookmark_surah',async(req,res)=>{
        const bookmarkSurah = req.body;
        const result = await bookmarkSurahCollection.insertOne(bookmarkSurah);
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
};

run().catch((error) => console.log);

app.get("/", (req, res) => {
  res.send("Al-Quran Server Running...");
});

app.listen(port, () => console.log("App running on port", port));
