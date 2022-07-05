const express = require('express')
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

// requiring the port
const port = process.env.PORT || 3000
const host = process.env.HOST 

//adding the middlewares
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
var uri = process.env.DBURL;
mongoose.connect(uri, {useUnifiedTopology:true, useNewUrlParser:true});

var db = mongoose.connection;

db.once('open', (req, res)=>
{
    console.log('Connection Has been established');
});

// require routes 
const routes = require('./apis/routes/userRoutes')
const productsRoute = require('./apis/routes/productRoute')

app.use('/api', routes)
app.use('/api', productsRoute)









app.listen(port, (err, success)=>{
if(!err){
    console.log(`Server is running on http://${host}:${port}`)
}else{
    console.log(err)
}
})