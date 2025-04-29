import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CartPage = () => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});
  const navigate = useNavigate();
  const customerId = localStorage.getItem("userId");

  // Helper function to calculate total
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Fetch cart data
  const fetchCartData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5500/api/cart/${customerId}`);
      setCart(res.data.cart || { items: [], totalPrice: 0 });
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Treat "cart not found" as an empty cart
        setCart({ items: [], totalPrice: 0 });
        setError(null); // clear any previous error
      } else {
        setError('Failed to fetch cart data');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const clearCart = async () => {
    try {
      setLoading(true);
      await axios.delete('http://localhost:5500/api/cart/clear', {
        data: { customerId },
      });
      setCart({ items: [], totalPrice: 0 }); // Reset UI state
      navigate('/customer/dashboard'); // Redirect to dashboard
    } catch (err) {
      console.error('Failed to clear cart:', err);
      alert('Failed to clear cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchCartData();
  }, [customerId]);

  // Update item quantity with optimistic UI
  const updateQuantity = async (itemId, delta) => {
    try {
      // Optimistic UI update: Update the quantity in the UI first.
      setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
      
      // Find the item and update the quantity optimistically in the cart.
      setCart(prevCart => {
        const updatedItems = prevCart.items.map(item => {
          if (item.itemId === itemId) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
          }
          return item;
        });
        return {
          ...prevCart,
          items: updatedItems,
          totalPrice: calculateTotal(updatedItems),
        };
      });
  
      // Sync with backend immediately
      const updatedItem = cart.items.find(i => i.itemId === itemId);
      await axios.put('http://localhost:5500/api/cart/update', {
        customerId,
        itemId,
        quantity: updatedItem.quantity + delta,
      });
  
    } catch (err) {
      console.error('Failed to update quantity:', err);
      // Revert the optimistic UI update if the API call fails.
      fetchCartData();
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };
  

  // Remove item with optimistic UI
  const removeItem = async (itemId) => {
    try {
      setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

      // Optimistic UI update
      setCart(prevCart => {
        const updatedItems = prevCart.items.filter(item => item.itemId !== itemId);
        return {
          ...prevCart,
          items: updatedItems,
          totalPrice: calculateTotal(updatedItems)
        };
      });

      // Sync with backend
      await axios.delete('http://localhost:5500/api/cart/remove', {
        data: { customerId, itemId }
      });

    } catch (err) {
      console.error('Failed to remove item:', err);
      fetchCartData(); // Revert on error
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    try {
        setLoading(true);
        
        // First get the current cart data
        const cartResponse = await axios.get(`http://localhost:5500/api/cart/${customerId}`);
        const cart = cartResponse.data.cart;
        

        if (!cart || cart.items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Then proceed with checkout
        //const checkoutResponse = await axios.post('http://localhost:5500/api/cart/checkout', {
          //  customerId
       // });
        
        // Navigate to payment page with ALL required data
        navigate('/payment/checkout', { 
            state: { 
              
                customerId: customerId,
                cartId: cart._id,
                restaurantId: cart.restaurantId,
                

            } 
        });
    } catch (err) {
        console.error('Checkout failed:', err);
        alert('Failed to proceed to payment. Please try again.');
    } finally {
        setLoading(false);
    }
};

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg.png)' }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchCartData}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading && cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg.png)' }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg.png)' }}>
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#103713] mb-6">Your Cart</h2>

            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block bg-white border border-[#E2DBD0] rounded-xl p-8 max-w-md">
                  <div className="text-5xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-[#103713] mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Looks like you haven't added any items yet</p>
                  <button
                    onClick={() => navigate('/customer/restaurants')}
                    className="px-6 py-2 bg-[#628b35] text-white rounded-lg hover:bg-[#4a6b2a] transition-colors"
                  >
                    Browse Restaurants
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="divide-y divide-[#E2DBD0]">
                  {cart.items.map(item => (
                    <div key={item.itemId} className="py-4 flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#628b35]">{item.itemName}</h3>
                        <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-[#E2DBD0] rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.itemId, -1)}
                            className="px-3 py-1 text-[#103713] hover:bg-gray-100 disabled:opacity-50"
                            disabled={item.quantity <= 1 || updatingItems[item.itemId]}
                          >
                            -
                          </button>
                          <span className="px-3">
                            {updatingItems[item.itemId] ? (
                              <span className="inline-block h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></span>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.itemId, 1)}
                            className="px-3 py-1 text-[#103713] hover:bg-gray-100 disabled:opacity-50"
                            disabled={updatingItems[item.itemId]}
                          >
                            +
                          </button>
                        </div>

                        <p className="w-20 text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>

                        <button
                          onClick={() => removeItem(item.itemId)}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                          disabled={updatingItems[item.itemId]}
                        >
                          {updatingItems[item.itemId] ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-[#E2DBD0] pt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#103713]">Total</h3>
                    <p className="text-xl font-bold">${cart.totalPrice.toFixed(2)}</p>
                  </div>

                  <div className="mt-6 flex justify-between space-x-4">
                    <button
                      onClick={() => navigate('/customer/restaurants')}
                      className="flex-1 py-2 border border-[#103713] text-[#103713] rounded-lg hover:bg-gray-100 transition-colors"
                      disabled={loading}
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 py-2 bg-[#628b35] text-white rounded-lg hover:bg-[#4a6b2a] transition-colors"
                      disabled={loading || cart.items.length === 0}
                    >
                      {loading ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
                    <button
                      onClick={() => clearCart()}
                      className="flex-1 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
                      disabled={loading || cart.items.length === 0}
                    >
                      {loading ? 'Clearing...' : 'Clear Cart'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
