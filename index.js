const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ep4dk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);


const port =process.env.PORT || 5500

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello DataBase Working!')
  })

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const newsCollection = client.db("dailyNews").collection("news");
    const adminCollection = client.db("dailyNews").collection("admin");

    app.get('/news', (req, res) => {
      newsCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
    })

    app.post('/addNews', (req, res) =>{
        const newNews = req.body;
        console.log('adding new service:', newNews);
        newsCollection.insertOne(newNews)
        .then(result => {
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
      })



      app.post('/addAdmin', (req, res) =>{
        const newAdmin = req.body;
        console.log('adding new admin:', newAdmin);
        adminCollection.insertOne(newAdmin)
        .then(result => {
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
      })


      app.get('/adminCheck', (req, res) => {
        const email = req.query.email;
        adminCollection.find({email: email})
        .toArray((err, admin) => {
          console.log(admin.length)
          res.send(admin)
        })
      })

      app.get('/category', (req, res) => {
        const category = req.query.category;
        console.log(category)
        newsCollection.find({category: category})
        .toArray((err, items) => {
          console.log(items)
          res.send(items)
        })
      })



  });


app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })