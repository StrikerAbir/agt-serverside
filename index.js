const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 1000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();


// middleware
app.use(cors());
app.use(express.json());

// env variable datas
const user = process.env.DB_USER;
const password = process.env.PASS;

// mongodb and api
const uri = `mongodb+srv://${user}:${password}@cluster0.nvx6pod.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});



async function run() {
  try {
    const usersCollection = client.db('agtServer').collection('users');

    app.get('/user', async (req, res) => {
      const uname = req.query.name;
      const query = { name: uname }
      const result = await usersCollection.findOne(query);
      if (result) {
        res.send(true);
      }else{res.send(false)}

    })
    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })
    
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running...");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
