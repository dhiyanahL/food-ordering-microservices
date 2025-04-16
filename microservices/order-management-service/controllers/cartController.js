const Cart = require('../models/Cart');
const Order = require('../models/Order');

//add items to cart
const addToCart = async (req, res) => {
    const { customerId, customerName } = req.body; //get from token
    const {itemId, itemName, price, quantity, restaurantId} = req.body;

    try {
        //check if cart already exists
        let cart = await Cart.findOne({ customerId });

        if(!cart) {
            cart = new Cart({
                customerId,
                customerName,
                restaurantId,
                items: [],
                totalPrice: 0,
            });
        }

        //check if item already exists in cart
        const existingItem = cart.items.find(item => item.itemId === itemId);
        if(existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ itemId, itemName, price, quantity });
        }
        //calculate total price
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();

        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//update item quantity in cart
const updateItemQuantity = async (req, res) => {
    const { customerId } = req.body; //get from token
    const { itemId, quantity } = req.body;

    try {
        const cart =  await Cart.findOne({ customerId });

        if(!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        item.quantity = quantity;

        //calculate total
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();

        res.status(200).json({ message: 'Item quantity updated successfully', cart });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};