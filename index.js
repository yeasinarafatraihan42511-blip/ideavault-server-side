const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    const db = client.db("ideaVault");
    const ideasCollection = db.collection("ideas");

    app.get('/ideas', async (req, res) => {
      const result = await ideasCollection.find().toArray();
      res.json(result);
    });




  app.post('/ideas', async (req, res) => {
    const ideaData = req.body;
    console.log(ideaData);
    const result = await ideasCollection.insertOne(ideaData);
    res.json(result);
  })

  app.get('/ideas/:id', async (req, res) => {
    const id = req.params.id;
    const result = await ideasCollection.findOne({ _id: new ObjectId(id) });
    res.json(result);
  });
  app.delete("/ideas/:id",async(req,res)=>{

const id=req.params.id;

const query={
_id:new ObjectId(id)
}

const result=await ideasCollection.deleteOne(query);

res.send(result);

})

app.get("/my-ideas/:email", async (req, res) => {

const email=req.params.email;

const query={
userEmail:email
}

const result=await ideasCollection
.find(query)
.sort({createdAt:-1})
.toArray();

res.send(result);

})
  
  app.patch('/ideas/:id', async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;  
    const result = await ideasCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    res.json(result);
  });





  
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req, res) => {
    res.send("server is running successfully");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});