const Cart = require("../../models/cart.model");
const Book = require("../../models/book.model");
const PaymentMethod = require("../../models/payment-method.model");
const { calculateNewPrice } = require("../../../../helpers/book");
const Order = require("../../models/order.model");
const crypto = require('crypto');
const axios = require('axios');

// [GET] /checkout
module.exports.checkout = async (req, res) => {
    const cartId = req.cart._id;
    try {
        const cart = await Cart.findOne({ _id: cartId })
            .populate({
                path: "user_id",
                select: "fullName phone address"
            })
            .populate({
                path: "books.book_id",
                select: "title thumbnail price slug discountPercent"
            });

        const selectedBooks = cart.books.filter(b => b.isSelected);

        const books = selectedBooks.map(item => {
            const newPrice = calculateNewPrice(item.book_id);
            return {
                ...item.toObject(),
                newPrice,
                totalAmount: item.quantity * newPrice
            };
        });

        const totalPrice = books.reduce((s, b) => s + b.totalAmount, 0);

        let shippingFee = totalPrice < 300000 ? 30000 : 0;
        let total = totalPrice + shippingFee;

        res.json({
            book: {
                books,
                totalPrice,
                shippingFee,
                total
            },
            user: cart.user_id
        })

    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [POST] /checkout
module.exports.createOrder = async (req, res) => {
    const cartId = req.cart._id;
    const { fullName, phone, address, note, payment_method_id, carrier_id } = req.body;
    try {
        const cart = await Cart.findOne({ _id: cartId })
            .populate({
                path: "books.book_id",
                select: "price discountPercent"
            });

        const selectedBooks = cart.books.filter(b => b.isSelected);

        const books = selectedBooks.map(item => {
            const newPrice = calculateNewPrice(item.book_id);
            return {
                book_id: item.book_id._id,
                price: item.book_id.price,
                discountPercent: item.book_id.discountPercent,
                quantity: item.quantity,
                totalAmount: item.quantity * newPrice
            };
        });

        const userInfor = { fullName, phone, address, note };

        const totalPrice = books.reduce((s, b) => s + b.totalAmount, 0);

        let shipping_fee = totalPrice < 300000 ? 30000 : 0;

        const order = new Order({
            user_id: cart.user_id,
            cart_id: cartId,
            userInfor,
            payment_method_id,
            carrier_id,
            books,
            shipping_fee,
            totalPrice: totalPrice + shipping_fee
        });

        await order.save();

        const paymentMethod = await PaymentMethod.findById(payment_method_id);
        if (paymentMethod.name === "COD") {
            //Cập nhật lại số lương tồn kho sách
            const updates = order.books.map(item => ({
                updateOne: {
                    filter: { _id: item.book_id },
                    update: { $inc: { stockQuantity: -item.quantity } }
                }
            }));
            await Book.bulkWrite(updates);

            //Xóa sách trong giỏ hàng
            await Cart.findByIdAndUpdate(
                order.cart_id,
                { $pull: { books: { isSelected: true } } }
            );
            return res.json({ orderId: order._id });
        }

        var accessKey = process.env.MOMO_ACCESS_KEY;
        var secretKey = process.env.MOMO_SECRET_KEY;
        var orderInfo = `Thanh toán đơn hàng ${order._id}`;
        var partnerCode = 'MOMO';
        var redirectUrl = `https://google.com`;
        var ipnUrl = 'https://monte-unpreluded-biophysically.ngrok-free.dev/api/v1/checkout/callback';
        var requestType = "payWithMethod";
        var amount = Math.round(totalPrice + shipping_fee).toString();
        var orderId = order._id.toString();
        var requestId = orderId;
        var extraData = '';
        var orderGroupId = '';
        var autoCapture = true;
        var lang = 'vi';

        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
        });

        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };

        const result = await axios(options);
        res.status(200).json(result.data.payUrl);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// [POST] /checkout/callback
module.exports.callback = async (req, res) => {
    try {
        const {
            orderId,
            transId,
            resultCode
        } = req.body;

        console.log(orderId, " ", transId);

        const order = await Order.findById(orderId);

        if (resultCode === 0) {
            //Cập nhật lại số lương tồn kho sách
            const updates = order.books.map(item => ({
                updateOne: {
                    filter: { _id: item.book_id },
                    update: { $inc: { stockQuantity: -item.quantity } }
                }
            }));
            await Book.bulkWrite(updates);

            //Xóa sách trong giỏ hàng
            await Cart.findByIdAndUpdate(
                order.cart_id,
                { $pull: { books: { isSelected: true } } }
            );

            order.paymentStatus = "PAID";
            order.momoTransId = transId;
        } else {
            order.paymentStatus = "FAILED";
        }



        await order.save();

        res.json({ message: "SUCCESS" });
    } catch (error) {
        res.status(500).json("Lỗi server!");
    }
};


// [GET] /:orderId/thank-you
module.exports.thankYou = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate({ path: "payment_method_id", select: "name" })
            .populate({ path: "carrier_id", select: "name" })
            .populate({ path: "books.book_id", select: "title" });

        if (!order) return res.status(404).send("Order not found");

        let message = "Thanh toán chờ xử lý";
        if (order.paymentStatus === "FAILED") {
            message = "Thanh toán thất bại"
        }
        if (order.paymentStatus === "PAID") {
            message = "Thanh toán thành công"
        }

        res.json({
            message,
            orderId: order._id,
            paymentMethod: order.payment_method_id.name,
            carrier: order.carrier_id.name,
            books: order.books,
            shipping_fee: order.shipping_fee,
            totalPrice: order.totalPrice
        });
    } catch (error) {
        res.status(500).json("Lỗi server!");
    }
};