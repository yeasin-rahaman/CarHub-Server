const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eeiu8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log('mogno  :',uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("Car-Hub");
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');
        const customerReviewCollection = database.collection('review');
        const userCollection = database.collection('user');

        // Get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        // Get singel Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service)

        })


        // make order 
        app.post('/addOrders', async (req, res) => {
            const result = await ordersCollection.insertOne(req.body)
            res.send(result)
        })

        // get my orders 
        app.get('/myOrder/:uid', async (req, res) => {
            const result = await ordersCollection.find({ uid: req.params.uid }).toArray()
            res.send(result)
        })

        // get all orders 
        app.get('/allOrders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // add review 
        app.post('/addSReview', async (req, res) => {
            const result = await customerReviewCollection.insertOne(req.body)
            res.send(result)
        })

        // get all review 
        app.get('/review', async (req, res) => {
            const cursor = customerReviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        })


        // add user info
        app.post("/addUserInfo", async (req, res) => {
            const result = await userCollection.insertOne(req.body)
            res.send(result)
            console.log(result)
        })

        // app.put('/addUserInfo', async (req, res) => {

        //     const user = req.body;
        //     // console.log(email)
        //     const filter = { email: user };
        //     const options = { upsert: true };
        //     const updateDoc = { $set: user };
        //     const result = await userCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        //     console.log(result)
        // });







        // POST API

        app.post('/services', async (req, res) => {

            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);

        });

        // Delete Api

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);


        })

    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Server')

});

app.listen(port, () => {
    console.log('Running server is port', port);
});