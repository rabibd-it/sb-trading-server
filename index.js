const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hikaa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('sb_tradings');
        const usersCollection = database.collection('users');
        const productsCollection = database.collection('products');
        const reviewsCollection = database.collection('reviews');
        const brandsCollection = database.collection('brands');
        const dealersCollection = database.collection('dealers');
        const productOrderCollection = database.collection('orders');

        // Get Users List API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find(req.query ? req.query : {});
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get POST User API
        app.post('/users', async (req, res) => {
            const result = await usersCollection.insertOne(req.body);
            res.json(result);
        });

        // GET User PUT API
        app.put('/users', async (req, res) => {
            const filter = { email: req.body };
            const options = { upsert: true };
            const updateUser = { $set: req.body };
            const result = await usersCollection.updateOne(filter, updateUser, options);
            res.json(result);
        });

        // GET USER ROLE API
        app.put('/users/admin', async (req, res) => {
            const user = await usersCollection.findOne(req.body);
            if (user && user.role === 'customer') {
                const filter = { email: user.email };
                const updateUser = { $set: { role: 'admin' } };
                const result = await usersCollection.updateOne(filter, updateUser);
                res.json(result);
            } else if (user && user.role === 'admin') {
                res.json({ message: 'you are already an admin' });
            }
            else {
                res.json({ message: 'no email address foound' });
            }
        });

        //GET Products API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // GET Products POST API
        app.post('/products', async (req, res) => {
            const result = await productsCollection.insertOne(req.body);
            res.json(result);
        });

        // GET Single Product API
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        });

        // Delete User Order API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        });

        // Get Product Order API
        app.post('/products/order', async (req, res) => {
            const result = await productOrderCollection.insertOne(req.body);
            res.json(result);
        });

        //GET User Orders API
        app.get('/my-orders', async (req, res) => {
            const cursor = productOrderCollection.find(req.query ? req.query : {});
            const result = await cursor.toArray();
            res.send(result);
        });

        //UPDATE User Order Status API
        app.put('/my-orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateOrder = {
                $set: req.body
            };
            const result = await productOrderCollection.updateOne(filter, updateOrder, options);
            res.json(result)

        })

        // Delete User Order API
        app.delete('/my-orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productOrderCollection.deleteOne(query);
            res.json(result);
        });

        //GET Reviews API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find(req.query ? req.query : {});
            const result = await cursor.toArray();
            res.send(result);
        });

        // Post User Reviews API
        app.post('/reviews', async (req, res) => {
            const result = await reviewsCollection.insertOne(req.body);
            res.json(result);
        });

        //GET Brands API
        app.get('/brands', async (req, res) => {
            const cursor = brandsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        //GET Dealers API
        app.get('/dealers', async (req, res) => {
            const cursor = dealersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('SB Trading server is running');
});

app.listen(port, () => {
    console.log('SB Trading running at port', port);
})