const User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

dotenv.config()
const { generalAccessToken, generalRefreshToken } = require("./jwtService");

const createUser = (newUser) => {
    const { email, password } = newUser;
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser) {
                resolve({
                    status: '400',
                    message: 'The email is already exists'
                });
            }

            // 10: Là số lượt lặp (rounds) được sử dụng trong quá trình tạo hash. Càng cao giá trị này, thời gian tính toán càng tăng, làm tăng độ khó cho bất kỳ tấn công brute-force nào.
            const hash = bcrypt.hashSync(password, 10);
            //ko cần lưu confirm password vào db
            const createUser = await User.create({
                ...newUser, password: hash
            })

            if (createUser) {
                resolve({
                    status: '200',
                    message: 'Create account success',
                    data: createUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (user) => {
    const { email, password } = user;
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (!checkUser) {
                resolve({
                    status: '404',
                    message: 'The email is incorrect'
                });
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password);

            if (!comparePassword) {
                resolve({
                    status: '404',
                    message: 'The password is incorrect',
                })
            }


            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })


            resolve({
                status: '200',
                message: 'Login Success',
                access_token,
                refresh_token
            })

        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id })
            if (!checkUser) {
                resolve({
                    status: '404',
                    message: 'The email is incorrect'
                });
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true });

            resolve({
                status: '200',
                message: 'Success',
                data: updateUser
            })

        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id })
            if (!checkUser) {
                resolve({
                    status: '404',
                    message: 'The email is incorrect'
                });
            }

            await User.findByIdAndDelete(id);

            resolve({
                status: '200',
                message: 'Delete user success',
            })

        } catch (e) {
            reject(e)
        }
    })
}
const deleteMany = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids });

            resolve({
                status: '200',
                message: 'Delete success',
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find({})


            resolve({
                status: '200',
                message: 'Get all user success',
                data: allUser
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailUser = await User.findOne({ _id: id })

            resolve({
                status: '200',
                message: 'Get detail user success',
                data: detailUser
            })

        } catch (e) {
            reject(e)
        }
    })
}

const refreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_PASS_REFRESH, async function (err, user) {
            if (err) {
                reject(err)
            }
            let newAccess_Token = '';
            if (user) {
                const { payload } = user;
                newAccess_Token = await generalAccessToken({
                    id: payload?.id,
                    isAdmin: payload?.isAdmin
                });
            }

            resolve({
                status: '200',
                message: 'Success',
                newAccess_Token
            })
        });


    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    deleteMany,
    getAllUser,
    getDetailUser,
    refreshToken
}