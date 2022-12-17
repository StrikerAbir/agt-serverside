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
    const postsCollection = client.db('agtServer').collection('posts');
    const commentCollection = client.db('agtServer').collection('comments');

    app.get('/user', async (req, res) => {
      const uname = req.query.name;
      const query = { name: uname }
      const result = await usersCollection.findOne(query);
      if (result) {
        res.send({available:true, email: result.email});
      }else{res.send(false)}

    })
    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })

    app.get('/posts', async (req, res) => {
      const query = {};
      const result = await postsCollection.find(query).toArray();
      res.send(result)
    })
    app.post('/posts', async (req, res) => {
      const user = req.body;
      const result = await postsCollection.insertOne(user);
      res.send(result)
    })
    app.delete('/post', async (req, res) => {
      const id = req.query.id;
      // console.log(id);
      const result = await postsCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/upPost/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = {_id: ObjectId(id)}
      const result = await postsCollection.findOne(query)
      res.send(result)
    })
    app.patch('/postUpdate', async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) }
      const {upPost}=req.body
      console.log(id,upPost);
       const updatedDoc = {
         $set: {
           post: upPost
         },
      };
      const result = await postsCollection.updateOne(query, updatedDoc);
      res.send(result)
    })
    app.patch('/likeUpdate', async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) }
      const {upLike}=req.body
      // console.log(id,upLike);
       const updatedDoc = {
         $set: {
           like: upLike
         },
      };
      const result = await postsCollection.updateOne(query, updatedDoc);
      res.send(result)
    })
    
    // app.patch()
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
