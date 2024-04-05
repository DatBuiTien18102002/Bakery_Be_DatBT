const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const bcrypt = require('bcrypt');

const { generalAccessToken, generalRefreshToken } = require("./jwtService");

const createOrder = (newOrder) => {
    const { orderItems } = newOrder;
    return new Promise(async (resolve, reject) => {
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    //Phần tìm
                    {
                        _id: order._id,
                        //coutInStock phải lớn hơn hoặc bằng (gte)  order.amount
                        countInStock: { $gte: order.amount }
                    },
                    //Phần update
                    // Sử dụng $inc để tăng (+) hoặc giảm (-) giá trị của một trường trong bản ghi.
                    // countInStock giảm đi order.amount (đã bán đi) và selled tăng lên order.amount
                    {
                        $inc: {
                            countInStock: -order.amount,
                            sell: +order.amount
                        }
                    },
                    // Tùy chọn này đảm bảo rằng kết quả trả về sẽ là bản ghi đã được cập nhật, chứ không phải bản ghi gốc trước khi cập nhật
                    { new: true }
                )
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS'
                    }
                }
                else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.productId
                    }
                }

            })
            //Đợi tất cả promise ở trên hoàn thành
            const results = await Promise.all(promises)

            //Lọc các sản phẩm có số lượng mua vượt quá số lượng tồn kho
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                // const arrId = []
                // newData.forEach((item) => {
                //     arrId.push(item.id)
                // })
                resolve({
                    status: 'ERR',
                    // message: `San pham voi id: ${arrId.join(',')} khong du hang`
                    message: `San pham voi id: ${newData.map((item) => item.id).join(',')} khong du hang`
                })
            } else {
                // const createdOrder = await Order.create({
                //     orderItems,
                //     shippingAddress: {
                //         email,
                //         address,
                //         city, phone
                //     },
                //     paymentMethod,
                //     shippingMethod,
                //     price,
                //     userId,
                // })
                const createdOrder = await Order.create({ ...newOrder });
                if (createdOrder) {
                    resolve({
                        status: '200',
                        message: 'Create order success',
                        data: createdOrder
                    })
                }
            }


        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {

            // Sắp xếp kết quả theo thời gian tạo (createdAt) và thời gian cập nhật (updatedAt) theo thứ tự giảm dần
            const orders = await Order.find().sort({ createdAt: -1, updatedAt: -1 });
            if (orders === null) {
                resolve({
                    status: 'Err',
                    message: 'Can not find the order in db',
                })
            }

            resolve({
                status: '200',
                message: 'Success',
                data: orders
            })

        } catch (e) {
            reject(e)
        }
    })
}
const getOrderById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find({ userId: id }).sort({ createdAt: -1, updatedAt: -1 })
            if (orders === null) {
                resolve({
                    status: 'Err',
                    message: 'Can not find the order in db',
                })
            }

            resolve({
                status: '200',
                message: 'Success',
                data: orders
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getOrderDetail = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({ _id: id })
            if (order === null) {
                resolve({
                    status: 'Err',
                    message: 'Can not find the order in db',
                })
            }

            resolve({
                status: '200',
                message: 'Success',
                data: order
            })

        } catch (e) {
            reject(e)
        }
    })
}

const updateOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await Order.findOne({ _id: id })
            if (!checkOrder) {
                resolve({
                    status: '404',
                    message: 'The orderId is incorrect'
                });
            }

            const updateOrder = await Order.findByIdAndUpdate(id, data, { new: true });

            resolve({
                status: '200',
                message: 'Success',
                data: updateOrder
            })

        } catch (e) {
            reject(e)
        }
    })
}

const cancelOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let orders = [];
            const promises = data.map(async (orderItemProduct) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: orderItemProduct._id,
                        sell: { $gte: orderItemProduct.amount }
                    },
                    {
                        $inc: {
                            countInStock: +orderItemProduct.amount,
                            sell: -orderItemProduct.amount
                        }
                    },
                    { new: true }
                )
                if (!productData) {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: orderItemProduct.productId
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'Success',
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                resolve({
                    status: 'ERR',
                    // message: `San pham voi id: ${arrId.join(',')} khong du hang`
                    message: `San pham voi id:${newData.map((item) => item.id).join(',')} khong ton tai`
                })
            }

            let orderDelete = await Order.findByIdAndDelete(id)
            if (orderDelete === null) {
                resolve({
                    status: 'ERR',
                    message: 'Can not find and cancel order'
                })
            }

            resolve({
                status: '200',
                message: 'Success',
                // data: order
            })

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrder,
    getOrderById,
    getOrderDetail,
    updateOrder,
    cancelOrder,
}