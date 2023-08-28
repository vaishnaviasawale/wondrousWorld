// ****************************NOT FINAL ***************************
// *******************************************************************
// *******************************************************
const mongoose = require('mongoose');
const Discussion = require('../models/discussions');

// Connecting to mongoose
mongoose.connect('mongodb://127.0.0.1:27017/wondrous-world', 
{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('strictQuery', false);
const db = mongoose.connection;
// Setting const db so that you won't have to write "mongoose.connection" everywhere
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("Database connected");
});

const discussionDB = async() => {
    // deleting old ones everytime we write node discussions/index.js
    await Discussion.deleteMany({});

    for(let i = 0; i < 35; i++)
    {
        const a = new Article({
            title: `${written[i].title}`,
            author: `${written[i].author}`,
            profession: `${written[i].profession}`,
            date: `${written[i].date}`,
            image: `${written[i].image}`,
            para: `${written[i].para}`
        })
        await a.save();
    }
}

// articleDB(); 
// call the function so that the database is seeded
// everytime you call it, previous articles will be deleted and new articles will replace them
// In mongoDB -> use wondrous-world -> db.articles.find()

// we connect and we close
// in cmd write -> node articles/index OR node articles/index.js
articleDB().then(() => {
    mongoose.connection.close();
})