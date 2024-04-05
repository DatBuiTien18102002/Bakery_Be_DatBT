const UserService = require('../services/UserService');

const createUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password || !confirmPassword) {
            //Thiếu thông tin
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The email is invalid'
            })
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The password must equal confirm password'
            })
        }

        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password) {
            //Thiếu thông tin
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The email is invalid'
            })
        }

        const response = await UserService.loginUser(req.body);

        const { refresh_token, ...newResponse } = response;


        if (refresh_token) {
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                samesite: 'strict'
            });
        }
        return res.status(200).json(newResponse);

    } catch (e) {
        return res.status(409).json({
            err: e.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}
const deleteMany = async (req, res) => {
    try {
        const ids = req.body;
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        const response = await UserService.deleteMany(ids);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser();
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailUser(userId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const refreshToken = async (req, res) => {

    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The refresh token is required'
            })
        }
        const response = await UserService.refreshToken(token);
        return res.status(200).json(response);

    } catch (e) {
        if (e.message === "jwt expired") {
            res.clearCookie('refresh_token');
        }
        return res.status(404).json({
            err: e.message
        })
    }
}

const logoutUser = async (req, res) => {

    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({
            status: '200',
            message: 'Logout successfully'
        });

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    deleteMany,
    getAllUser,
    getDetailUser,
    refreshToken,
    logoutUser
}