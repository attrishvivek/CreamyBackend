const mongoose = require('mongoose');


/* const databaseURL = "mongodb+srv://Mamba_Wallet:Mamba123@cluster0.8bre7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
 */



const databaseURL = "mongodb+srv://vivek:vivek@cluster0.jm3n1.mongodb.net/mern?retryWrites=true&w=majority"

mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.....')
    } else {
        console.log('Error in DB connection: ' + err)

    }
});