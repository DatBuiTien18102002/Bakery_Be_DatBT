const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cors = require('cors')
const cookieParser = require('cookie-parser');
const session = require("express-session");
const passport = require("passport");

const connectToMongoDb = require("./config/db.config")
const routes = require('./routes');
const googleRouter = require("./config/google-auth");
const facebookRouter = require("./config/facebook-auth");

//đọc và load các biến môi trường từ tập tin
dotenv.config();

// Tránh lỗi khác origin
const app = express();
app.use(cors(
    {
        origin: process.env.URL_WEB,
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    }
));

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

//setup session
app.use(session({
    secret: process.env.SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: true
}))


//setup passport
app.use(passport.initialize());
app.use(passport.session())



passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser((user, done) => {
    done(null, user);
})

app.use("/auth/google", googleRouter);
app.use("/auth/facebook", facebookRouter);

routes(app);

connectToMongoDb()

app.listen(port, () => {
    console.log('Server is running in port:', port);
})