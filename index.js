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
            const orders = req.body
            delete orders._id
            const result = await ordersCollection.insertOne(req.body)
            res.send(result)
        })

        // get my orders 
        app.get('/myOrder/:email', async (req, res) => {
            const result = await ordersCollection.find({ email: req.params.email }).toArray()
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
        })



        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);

        });

        // make a user admin 
        app.put("/makeAdmin", async (req, res) => {
            console.log(req.body);
            const filter = { email: req.body.email };
            const result = await userCollection.find(filter).toArray();
            if (result) {
                const documents = await userCollection.updateOne(filter, {
                    $set: { role: "admin" },
                });
            }

        });


        // check admin or not 
        app.get("/checkAdmin/:email", async (req, res) => {
            const result = await userCollection
                .find({ email: req.params.email })
                .toArray();
            console.log(result);
            res.send(result);
        });



        //  update order status
        // app.put("/statusUpdate/:id", async (req, res) => {

        //     const filter = { _id: ObjectId(req.params.id) };
        //     console.log(filter)
        //     const result = await userCollection.updateOne(filter, {
        //         $set: {
        //             status: req.body.status,
        //         },
        //     });
        //     res.send(result);
        //     console.log(result);
        // })


        // Delete service 

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        })




        // cancel order 
        // app.delete('/cancelOrder/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log(id)
        //     const query = { _id: ObjectId(id) };
        //     const result = await userCollection.deleteOne(query);
        //     res.json(result);

        // })

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