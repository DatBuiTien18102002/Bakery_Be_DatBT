const { default: mongoose } = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const connectToMongoDb = () => {
    mongoose.connect(process.env.MONGO_DB)
        .then(() => {
            console.log("Connect Db success");
        })
        .catch((err) => {
            console.log(err.message);
        })
}

module.exports = connectToMongoDb;
