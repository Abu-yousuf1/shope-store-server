const express = require("express");
const { MongoClient } = require('mongodb');
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000
const ObjectId = require('mongodb').ObjectId;
const res = require("express/lib/response");
require('dotenv').config()

app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.o9fdd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("furnitureDB")
        const productCollection = database.collection("products")
        const orderCollection = database.collection("orders")

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const cursor = await productCollection.findOne(query)
            res.send(cursor)
            console.log(id)
        })
        app.post('/order', async (req, res) => {
            const cursor = req.body;
            const result = await orderCollection.insertOne(cursor)
            res.json(result)
        })
        app.get('/orders', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = orderCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
            console.log(email)
        })
        // order delete
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(filter)
            res.json(result)
        })
    } finally { }

} run().catch(console.dir);

app.get('/', (req, res) => {
    console.log("done")
    res.send("hello")
})

app.listen(port, () => {
    console.log("listening to", port)
})