const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// mongodb create

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.exrbbd1.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    

    const database = client.db("carDB");
    const brandCollection = database.collection("brands");
    const productCollection = database.collection("products");
    const cartsCollection = database.collection("carts");

    // brands data read
    app.get('/brands', async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    //create brands
    app.post('/brands', async (req, res) => {
      const newbrands = req.body
      console.log(newbrands)
      const result = await brandCollection.insertOne(newbrands);
      res.send(result)
    })



    // products data 
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })

  
    //brand wise product data
    app.get('/products/:brandname', async (req, res) => {
      const brands = req.params.brandname
      const query = { brandname: brands };
      const result = await productCollection.find(query).toArray();
      res.send(result)
    })

    // single item from products data 
    app.get('/product/:id', async (req, res) => {
      const id = req.params
      console.log(id)
      const query1 = { _id: new ObjectId(id) };
      const result1 = await productCollection.findOne(query1)
      res.send(result1)
    })

  
    //create products
    app.post('/products', async (req, res) => {
      const newproduct = req.body
      console.log(newproduct)
      const result = await productCollection.insertOne(newproduct);
      res.send(result)
    })

    //read carts data

    app.get('/carts', async (req, res) => {
      const cursor = cartsCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    // single data of carts
    app.get('/carts/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.findOne(query);
      res.send(result)
    })

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result)
    })

    
    //create carts
    app.post('/carts', async(req,res)=>{
      const newcart = req.body
      const result = await cartsCollection.insertOne(newcart)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('carCollection server is running')
})

app.listen(port, () => {
  console.log(`carCollection server is running on port ${port}`)
})