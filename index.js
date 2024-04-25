const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const { default: axios } = require("axios");
const port = process.env.PORT || 4000;
const uri = process.env.MONGO_URI;
// const secret = process.env.SITE_SECRET
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
    const surahCollection = client.db('al-quran-db').collection('surahs');

    app.get('/surahs',async(req,res)=>{
        const result = await surahCollection.find().toArray();
        res.send(result)
    })
      
    app.get('/surah/:id',async(req,res)=>{
        const id = parseInt(req.params.id);
        const filter = {surah_id: id}
        const result = await surahCollection.find(filter).toArray()
        res.send(result)
    })

    app.get('/bookmark_surah',async(req,res)=>{
        const result = await bookmarkSurahCollection.find().toArray();
        res.send(result)
    })

    app.get('/bookmark_surah/:email',async(req,res)=>{
        const email = req.params.email;

        const filter = {email: email};
        const result = await bookmarkSurahCollection.find(filter).toArray();
        res.send(result)
    })

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
