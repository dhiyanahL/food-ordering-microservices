import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'Customer';

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/cart/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
        setCart(res.data.cart);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put('http://localhost:5500/api/cart/update',
        { itemId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
      );
      setCart({
        ...cart,
        items: cart.items.map(item =>
          item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        ),
        totalPrice: cart.items.reduce((total, item) =>
          total + (item.price * (item.itemId === itemId ? newQuantity : item.quantity)), 0)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!cart) {
    return (
      <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg.png)' }}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <Sidebar role={role} isOpen={sidebarOpen} />
          <div className="flex-grow flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
              <p className="text-gray-600">Loading your cart...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed"
         style={{ backgroundImage: 'url(/images/bg.png)' }}>
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        <Sidebar role={role} isOpen={sidebarOpen} />

        {/* Main content area with white container */}
        <main className={`flex-grow transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
          <div className="container mx-auto px-4 py-8">
            {/* White container that sits on top of the background */}
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#103713] mb-6">Your Cart</h2>

              {cart.items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block bg-white border border-[#E2DBD0] rounded-xl p-8 max-w-md">
                    <div className="text-5xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold text-[#103713] mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6">Looks like you haven't added any items yet</p>
                    <button
                      onClick={() => navigate('/restaurants')}
                      className="px-6 py-2 bg-[#628b35] text-white rounded-lg hover:bg-[#4a6b2a] transition-colors"
                    >
                      Browse Restaurants
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cart items list */}
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
                              onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                              className="px-3 py-1 text-[#103713] hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                              className="px-3 py-1 text-[#103713] hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          <p className="w-20 text-right font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>

                          <button 
                            onClick={() => removeItem(item.itemId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart total and actions */}
                  <div className="mt-8 border-t border-[#E2DBD0] pt-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-[#103713]">Total</h3>
                      <p className="text-xl font-bold">${cart.totalPrice.toFixed(2)}</p>
                    </div>

                    <div className="mt-6 flex justify-between space-x-4">
                      <button
                        onClick={() => navigate('/restaurants')}
                        className="flex-1 py-2 border border-[#103713] text-[#103713] rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Continue Shopping
                      </button>
                      <button
                        onClick={handleCheckout}
                        className="flex-1 py-2 bg-[#628b35] text-white rounded-lg hover:bg-[#4a6b2a] transition-colors"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
