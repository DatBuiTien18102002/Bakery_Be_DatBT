const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const express = require("express");

const userController = require('../controllers/UserController');

const router = express.Router();
const dotenv = require('dotenv');

const clientGoogleID = process.env.CLIENT_GOOGLE_ID
const clientGoogleSecret = process.env.CLIENT_GOOGLE_SECRET

dotenv.config();

passport.use(
    new OAuth2Strategy({
        clientID: clientGoogleID,
        clientSecret: clientGoogleSecret,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"]
    },
        userController.handleGoogleAuth
    )
)

router.get("/", passport.authenticate("google", { scope: ['profile', "email"] }))

router.get("/callback", passport.authenticate("google", {
    successRedirect: process.env.URL_WEB,
    failureRedirect: process.env.URL_WEB
}))

module.exports = router;
