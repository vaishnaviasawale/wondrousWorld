const mongoose = require('mongoose');
const Page = require('../models/pages');

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

const pageDB = async() => {
    // deleting old ones everytime we write node pages/index.js
    await Page.deleteMany({});

    // for paintings
    for(let i = 0; i < 35; i++)
    {
        const p = new Page({
            section: 'paintings',
            title: `${i + 1}`
        })
        await p.save();
    }

    // for statues
    for(let i = 0; i < 35; i++)
    {
        const s = new Page({
            section: 'statues',
            title: `${i + 1}`
        })
        await s.save();
    }
}

// pageDB(); 
// call the function so that the database is seeded
// everytime you call it, previous pages will be deleted and new pages will replace them
// In mongoDB -> use wondrous-world -> db.pages.find()

// we connect and we close
// in cmd write -> node pages/index OR node pages/index.js
pageDB().then(() => {
    mongoose.connection.close();
})