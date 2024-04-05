const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const routes = require('./routes');
const bodyParser = require("body-parser");
const cors = require('cors')

const cookieParser = require('cookie-parser');


//đọc và load các biến môi trường từ tập tin
dotenv.config();

// Tránh lỗi khác origin
const app = express();
app.use(cors());
//--------------------------------
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
//--------------------------------
//Sử dụng body parser để lấy refresh token ở cookie
app.use(cookieParser())

const port = process.env.PORT || 3002


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

routes(app);

mongoose.connect(process.env.MONGO_DB)
    .then(() => {
        console.log("Connect Db success");
    })
    .catch((err) => {
        console.log(err.message);
    })

app.listen(port, () => {
    console.log('Server is running in port:', port);
})