import React, { useState, useEffect, useRef } from 'react';

const DeliveryTrackerPage = () => {
  const [driver, setDriver] = useState({
    name: 'John Doe',
    phone: '+94 76 123 4567',
    vehicle: 'Honda Dio (Blue)',
    rating: 4.8
  });
  const [status, setStatus] = useState('On the way');
  const [eta, setEta] = useState('15 minutes');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Locations (FAB Malabe to SLIIT Malabe)
  const locations = {
    driver: { lat: 6.9147, lng: 79.9730 }, // FAB Malabe
    customer: { lat: 6.9140, lng: 79.9725 } // SLIIT Malabe
  };

  useEffect(() => {
    // Initialize map only once
    if (mapLoaded || !mapRef.current) return;

    const initMap = () => {
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: locations.driver,
          zoom: 17
        });

        // Customer marker (SLIIT)
        new window.google.maps.Marker({
          position: locations.customer,
          map: map,
          label: "C",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }
        });

        // Driver marker (FAB)
        markerRef.current = new window.google.maps.Marker({
          position: locations.driver,
          map: map,
          label: "D",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
          }
        });

        // Simulate movement
        const interval = setInterval(() => {
          if (markerRef.current) {
            const newPos = {
              lat: markerRef.current.getPosition().lat() - 0.0001,
              lng: markerRef.current.getPosition().lng() - 0.0001
            };
            markerRef.current.setPosition(newPos);
          }
        }, 1000);

        setMapLoaded(true);
        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => console.error("Google Maps script failed to load");
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [mapLoaded]);

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg.png)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#103713] mb-6">Track Your Delivery</h2>

          {/* Map Container */}
          <div 
            ref={mapRef} 
            className="mb-8 h-[400px] w-full rounded-lg overflow-hidden"
            style={{ backgroundColor: '#e0e0e0' }}
          >
            {!mapLoaded && (
              <div className="h-full flex items-center justify-center">
                <p>Loading map...</p>
              </div>
            )}
          </div>

          {/* Delivery Details */}
          <div className="bg-[#FFFDF5] p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-[#628b35] mb-4">Delivery Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#103713] mb-2">Driver Information</h4>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-lg">🚗</span>
                  </div>
                  <div>
                    <p className="font-medium">{driver.name}</p>
                    <p className="text-sm text-gray-600">{driver.vehicle}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Phone:</span> {driver.phone}</p>
                  <p><span className="font-medium">Rating:</span> {driver.rating}/5.0</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#103713] mb-2">Delivery Status</h4>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Order Progress</span>
                    <span className="text-sm font-medium">{status}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#628b35] h-2.5 rounded-full"
                      style={{ width: status === 'Preparing' ? '25%' : status === 'On the way' ? '65%' : '100%' }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Estimated Arrival:</span> {eta}</p>
                  <p><span className="font-medium">Current Location:</span> Near FAB Malabe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTrackerPage;
