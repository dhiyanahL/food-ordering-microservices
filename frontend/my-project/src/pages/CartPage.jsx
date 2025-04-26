import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://order-service/api/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
        setCart(res.data.cart);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await axios.put('http://order-service/api/cart/update', 
      { itemId, quantity: newQuantity },
      { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    });
    // Optimistic UI update
    setCart({
      ...cart,
      items: cart.items.map(item => 
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item
      ),
      totalPrice: cart.items.reduce((total, item) => 
        total + (item.price * (item.itemId === itemId ? newQuantity : item.quantity)), 0)
    });
  };

  const removeItem = async (itemId) => {
    await axios.delete('http://order-service/api/cart/remove', {
      data: { itemId },
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    });
    setCart({
      ...cart,
      items: cart.items.filter(item => item.itemId !== itemId),
      totalPrice: cart.items.reduce((total, item) => 
        item.itemId === itemId ? total : total + (item.price * item.quantity), 0)
    });
  };

  if (!cart) return <div className="loading">404 No cart found ...</div>;

  return (
    <div className="page-container" style={{ backgroundImage: 'url(/path/to/background.jpg)' }}>
      <div className="cart-container" style={{ backgroundColor: '#FFFDF5' }}>
        <h2 style={{ color: '#103713' }}>Your Cart</h2>
        {cart.items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map(item => (
                <div key={item.itemId} className="cart-item" style={{ borderBottom: '1px solid #E2DBD0' }}>
                  <h3 style={{ color: '#628b35' }}>{item.itemName}</h3>
                  <p>${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.itemId, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.itemId, item.quantity + 1)}>+</button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.itemId)}
                    style={{ color: '#103713' }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3 style={{ color: '#103713' }}>Total: ${cart.totalPrice.toFixed(2)}</h3>
              <button 
                onClick={() => navigate('/checkout')}
                style={{ backgroundColor: '#628b35', color: '#FFFDF5' }}
              >
                Proceed to Checkout
              </button>
              <button 
                onClick={() => navigate('/restaurants')}
                style={{ color: '#103713' }}
              >
                ← Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;