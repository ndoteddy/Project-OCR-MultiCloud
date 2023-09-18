//Require module
const express = require('express');
const bodyParser = require('body-parser')
// Express Initialize
const app = express();
const port = 8000;
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "<<YOUROWNCREDENTIAL-GETFROMMONGODB>>";


app.use(cors());
//create api
app.get('/hello_world', (req, res) => {
    res.send('Hello World');
})

app.get('/analysis/image', async(req, res) => {
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const imgName = req.query.name;
        // Send a ping to confirm a successful connection
        const query = {"ImgName":imgName};
        const dbName =  client.db("dbnando_demo")
        const collectionName = dbName.collection("image_analysis_with_rekognition");
        const result = await collectionName.findOne(query)
        res.json(result);
       
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }

})


app.post('/analysis/image', (req, res) => {  
    const body = req.body;
    var axios = require('axios');
    var data = JSON.stringify({
        "value": {
            "type": "JSON", 
            "data":{
                "imgName": body.imgName,
                "imgBase64": body.imgBase64
            }
        }
    });
    console.log(data);
    var config = {
        method: 'post',
        url: '<<YOUROWNKAFKACLUSTER>>',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': '<<YOUROWNAUTHENTICATION>>'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            res.json(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

})


app.listen(port, () => {
    console.log('listen port 8000');
})