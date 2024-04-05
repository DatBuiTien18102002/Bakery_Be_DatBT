const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config()
const generalAccessToken = async (payload) => {
    const accessToken = await jwt.sign({
        payload
    }, process.env.JWT_PASS_ACCESS, { expiresIn: '15m' })

    return accessToken
}
const generalRefreshToken = async (payload) => {
    const refreshToken = await jwt.sign({
        payload
    }, process.env.JWT_PASS_REFRESH, { expiresIn: '1w' })

    return refreshToken
}

module.exports = {
    generalAccessToken,
    generalRefreshToken
}