const Cart = require('../models/Cart');
const Order = require('../models/Order');

//add items to cart
const addToCart = async (req, res) => {
    const customerId = req.userId; //get from token
    const {itemId, itemName, price, quantity, restaurantId} = req.body;

    try {

        let cart = await Cart.findOne({ customerId });
        
        //check if cart already exists
        if (cart) {
            if (cart.restaurantId !== restaurantId) {
                return res.status(400).json({ message: 'You can only add items from the same restaurant. Please clear your cart to switch restaurants.' });
            }
        } else {
            cart = new Cart({
                customerId,
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
    const customerId = req.userId; //get from token
    const { itemId, quantity } = req.body;

    try {
        const cart =  await Cart.findOne({ customerId });

        if(!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.itemId === itemId);
        if(item) {
            item.quantity = quantity;
            //calculate total
            cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            await cart.save();

            res.status(200).json({ message: 'Item quantity updated successfully', cart });
        }
        else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }        
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//delete item from cart
const removeItemFromCart = async (req, res) => {
    const customerId = req.userId;
    const { itemId } = req.body;

    try {
        const cart = await Cart.findOne({customerId});

        if(!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.itemId !== itemId);

        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart successfully', cart });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//view the cart
const viewCart = async (req, res) => {
    const customerId = req.userId;

    try {
        const cart = await Cart.findOne({customerId});

        if(!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ message: 'Cart retrieved successfully', cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//checkout
const checkoutCart = async (req, res) => {
    const customerId = req.userId;

    try {
        const cart = await Cart.findOne({customerId});

        if(!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

            const newOrder = new Order({
            customerId,
            customerName: cart.customerName,
            restaurantId: cart.restaurantId,
            items: cart.items,
            totalPrice: cart.totalPrice,
            status: 'Pending',
            paymentStatus: 'Paid',
        });

        await newOrder.save();

        await Cart.deleteOne({customerId});

        res.status(200).json({
            message: 'Order placed successfully'
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({message: "An error occured"});
    }
};

const clearCart = async (req, res) => {
    const customerId = req.userId;

    try {
        await Cart.deleteOne({customerId});
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addToCart,
    updateItemQuantity,
    removeItemFromCart,
    viewCart,
    checkoutCart,
    clearCart
}