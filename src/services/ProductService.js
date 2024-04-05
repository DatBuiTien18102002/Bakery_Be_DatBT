const Product = require("../models/ProductModel");
const bcrypt = require('bcrypt');

const { generalAccessToken, generalRefreshToken } = require("./jwtService");

const createProduct = (newProduct) => {
    const {
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
    } = newProduct;
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                name
            })
            if (checkProduct) {
                resolve({
                    status: '400',
                    message: 'The name is already exists'
                });
            }

            const newProduct = await Product.create({
                name, image, type, price, countInStock, rating, description
            })

            if (createProduct) {
                resolve({
                    status: '200',
                    message: 'Success',
                    data: newProduct
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({ _id: id })
            if (!checkProduct) {
                resolve({
                    status: '404',
                    message: 'The name is incorrect'
                });
            }

            const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true });

            resolve({
                status: '200',
                message: 'Success',
                data: updateProduct
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailProduct = await Product.findOne({ _id: id })

            resolve({
                status: '200',
                message: 'Get detail product success',
                data: detailProduct
            })

        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({ _id: id })
            if (!checkProduct) {
                resolve({
                    status: '404',
                    message: 'The name is incorrect'
                });
            }

            await Product.findByIdAndDelete(id);

            resolve({
                status: '200',
                message: 'Delete product success',
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getProducts = (limit = 0, page = 1, _sort = "", _order = "", filter = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (filter.name) {
                filter = {
                    ...filter,
                    name: { '$regex': `^${filter.name}`, '$options': 'i' }
                }
            }

            const totalProduct = (await Product.find(filter)).length
            const productSkip = (page - 1) * limit;
            let totalPage = 1;
            if (limit) {
                totalPage = Math.ceil(totalProduct / limit);
            }

            if (!_sort || !_order) {
                const allProduct = await Product.find(filter).limit(limit).skip(productSkip);
                resolve({
                    status: '200',
                    message: 'Get all product success',
                    currentPage: page,
                    totalProduct: totalProduct,
                    totalPage: totalPage,
                    data: allProduct
                })
            } else if (_sort || _order) {
                const allProduct = await Product.find(filter).limit(limit).skip(productSkip).sort({
                    [_sort]: _order
                });
                resolve({
                    status: '200',
                    message: 'Get all product success',
                    currentPage: page,
                    totalProduct: totalProduct,
                    totalPage: totalPage,
                    data: allProduct
                })
            } else {
                reject({
                    status: '400',
                    message: 'You need to provide both _sort and _order',
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type');
            resolve({
                status: '200',
                message: 'Get all type success',
                allType: allType
            })


        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getProducts,
    getAllType
}