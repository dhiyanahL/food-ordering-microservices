const Order = require("../models/Order");
const Cart = require("../models/Cart");

//create order after payment
const createOrder = async (req, res) => {
    const { customerId, customerName } = req.body;

    try {
        const cart = await Cart.findOne({ customerId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const newOrder = new Order({
            customerId: cart.customerId,
            customerName: customerName || cart.customerName,
            restaurantId: cart.restaurantId,
            currencyCode: cart.currencyCode,
            items: cart.items,
            totalPrice: cart.totalPrice,
            status: 'Pending',
            paymentStatus: 'Paid',
        });

        await newOrder.save();
        await Cart.deleteOne({ customerId });

        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

//view order
const viewOrder = async (req, res) => {
    const {orderId} = req.params;

    try {
        const order = await Order.findById(orderId);

        if(!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({message: "Order retrieved successfully", order});
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

//handle refund scenarios
const processRefund = async(req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if(order.paymentStatus !== 'Paid') {
            return res.status(400).json({ message: "Order is not paid. Cannot refund" });
        }

        order.paymentStatus = 'Refunded';
        order.refundedAmount = order.totalPrice;
        order.status = 'Canceled';

        await order.save();
        res.status(200).json({ message: "Order refunded successfully", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

//view order history
const getOrderHistory = async (req, res) => {
    const { customerId } = req.query; // read from query params

    if (!customerId) {
        return res.status(400).json({ message: "Customer ID is required" });
    }

    try {
        const orders = await Order.find({ customerId }).sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({ message: "Order history retrieved successfully", orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// update order status
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Completed', 'Preparing', 'Sent to Deliver', 'Delivered', 'Canceled'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Get all orders for a specific restaurant
const getAllOrders = async (req, res) => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find().sort({ createdAt: -1 }); // Optionally, sort by creation date
        console.log("Orders Fetched:", orders);
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({
            message: "All orders retrieved successfully",
            orders,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    createOrder,
    viewOrder,
    processRefund,
    getOrderHistory,
    getAllOrders,
    updateOrderStatus,
};
