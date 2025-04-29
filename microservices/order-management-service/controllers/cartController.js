const Cart = require('../models/Cart');
const Order = require('../models/Order');

// Helper function to calculate total price
const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

//add items to cart
const addToCart = async (req, res) => {
    const {customerId, customerName, itemId, itemName, price, quantity, restaurantId} = req.body;

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
    const { customerId, itemId, quantity } = req.body;
    
    try {
      let cart = await Cart.findOne({ customerId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Find the item in the cart
      const item = cart.items.find(item => item.itemId === itemId);
      if (!item) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      // Update the quantity of the item
      item.quantity = quantity;
  
      // Recalculate the total price of the cart
      cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
      // Save the updated cart
      await cart.save();
  
      res.status(200).json({ message: 'Item quantity updated successfully', cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  

//delete item from cart
const removeItemFromCart = async (req, res) => {
    const { customerId, itemId } = req.body;

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
    const {customerId} = req.params;

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
    const { customerId } = req.body;

    try {
        const cart = await Cart.findOne({ customerId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Prepare data for payment service
        const paymentRequest = {
            amount: Math.round(cart.totalPrice * 100), // Convert to cents
            currency: 'USD',
            metadata: {
                userId: customerId,
                cartId: cart._id.toString(),
                restaurantId: cart.restaurantId
            }
        };

        // Call payment service
        const paymentResponse = await axios.post(
            'http://localhost:5300/api/Payment/createPaymentIntent', 
            paymentRequest
        );

        // Return all necessary data
        res.status(200).json({
            clientSecret: paymentResponse.data.clientSecret,
            paymentIntentId: paymentResponse.data.paymentIntentId,
            amount: cart.totalPrice,
            customerId,
            cartId: cart._id.toString(),
            restaurantId: cart.restaurantId,
            cartItems: cart.items // Include if needed by payment page
        });

    } catch (err) {
        console.error('Checkout error:', err);
        res.status(500).json({ 
            message: "Checkout failed",
            error: err.message 
        });
    }
};

const clearCart = async (req, res) => {
    const {customerId} = req.body;

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
