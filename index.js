const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

/// MIDDLEWARE 
app.use(cors());   //to connect btwn two ports
app.use(express.json()); // bodir vitorer JSON data Kparse kore amk dibe

//CODE FROM BD after  creating CLUSTER


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tyhb0.mongodb.net/?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection=client.db('emaJohn').collection('product');
        app.get('/product', async(req, res)=>{
            const query ={} // as WE  want all
            const cursor=productCollection.find(query);
            const products=  await cursor.limit(13).toArray()
            res.send (products);
        })
    }
finally{}
}
run().catch(console.dir);


  

// TO CHK THE connect, we make a API
app.get('/',(req,res)=> {
    res.send('IM running server from EMA');

});

app.listen(port,()=>{
    console.log('Listennnn to porrt', port);
})
