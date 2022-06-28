const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        //TO GET THE ITEMS 
        app.get('/product', async(req, res)=>{
            console.log('query',req.query);
            const page= parseInt(req.query.page);
            const size=parseInt(req.query.size);
            const query ={}; // as WE  want all
            const cursor=productCollection.find(query);
            let products;
            if(page || size){
                products=  await cursor.skip(page*size).limit(size).toArray();

            }
            else{
                products=  await cursor.toArray();

            }
            
            res.send (products);
        });
     // TO COUNT THE ITEMS
     app.get('/productCount',  async(req,res)=>{
         const count=  await productCollection.estimatedDocumentCount();
         res.send ({count}); // SEND AS A OBJECT whose property is ""
        });

    // POST method to get products by ids(keys)
  
     app.post('/productByKeys', async(req, res) =>{
        const keys = req.body;
        const ids = keys.map(id => ObjectId(id));
        const query = {_id: {$in: ids}}
        const cursor = productCollection.find(query);
        const products = await cursor.toArray();
        console.log(keys);
        res.send(products);
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
