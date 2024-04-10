const passport = require("passport");
const express = require("express");
const dotenv = require('dotenv');

const FaceBookStrategy = require("passport-facebook").Strategy;
const userController = require('../controllers/UserController');

const router = express.Router();

dotenv.config();

const clientFaceBookId = process.env.CLIENT_FACEBOOK_ID
const clientFaceBookSecret = process.env.CLIENT_FACEBOOK_SECRET

passport.use(
    new FaceBookStrategy({
        clientID: clientFaceBookId,
        clientSecret: clientFaceBookSecret,
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos']
    },
        userController.handleFaceBookAuth
    )
)

router.get("/", passport.authenticate("facebook"))

router.get("/callback", passport.authenticate("facebook", {
    successRedirect: process.env.URL_WEB,
    failureRedirect: process.env.URL_WEB
}
))

module.exports = router;
