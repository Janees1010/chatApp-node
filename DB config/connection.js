const mongoose = require('mongoose');

async function connect_db() {
    try {
        const dbUri = process.env.DB_URL;
        await mongoose.connect(dbUri);
        console.log("DB connected");
    } catch (err) {
        console.log(err);
    }
}

module.exports = connect_db; 

       