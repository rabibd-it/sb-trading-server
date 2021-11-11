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

        app.post('/users', async (req, res) => {
            const result = await usersCollection.insertOne(req.body);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateUser = { $set: req.body };
            const result = await usersCollection.updateOne(filter, updateUser, options);
            res.json(result);
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