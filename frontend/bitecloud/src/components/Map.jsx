import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';

const Map = ({ drivers, restaurants, onSelectOrder }) => {
  const mapStyles = {
    height: '500px',
    width: '100%',
    borderRadius: '8px'
  };

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={12}
      center={restaurants[0] || { lat: 6.9271, lng: 79.8612 }} // Default to Colombo
    >
      {/* Driver Markers (Green) */}
      {drivers.map(driver => (
        <Marker
          key={driver._id}
          position={driver.location}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#628b35',
            fillOpacity: 1,
            scale: 8,
            strokeColor: '#FFFDF5',
            strokeWeight: 2
          }}
        />
      ))}

      {/* Restaurant Markers (Red) */}
      {restaurants.map(restaurant => (
        <Marker
          key={restaurant._id}
          position={restaurant.location}
          onClick={() => onSelectOrder(restaurant.orderId)}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }}
        />
      ))}

      {/* Optional: Draw routes */}
      {selectedOrder && (
        <Polyline
          path={[
            selectedOrder.restaurantLocation,
            selectedOrder.customerLocation
          ]}
          options={{ strokeColor: '#103713', strokeWeight: 3 }}
        />
      )}
    </GoogleMap>
  );
};

export default Map;
