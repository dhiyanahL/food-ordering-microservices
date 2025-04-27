const Delivery = require('../models/deliveryModel');
const Order = require('../models/orderModel'); 
const Driver = require('../models/driverModel'); //dhi's model


//get delivery location
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = angle => angle * (Math.PI / 180);
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

//assign delivery
const assignDelivery = async (req, res) => {
    const {orderId} = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }
        const availableDrivers = await Driver.find({isAvailable: true});
        if (availableDrivers.length === 0) {
            return res.status(404).json({message: 'No available drivers'});
        }

        let closestDriver = null;
        let minDistance = Infinity;
        for(let driver of availableDrivers) {
            const {lat, lng} = driver.currentLocation || {};
            if (lat && lng) {
                const dist = calculateDistance(
                    lat, lng, restaurantLocation.lat, restaurantLocation.lng
                );
                if(dist < minDistance) {
                    minDistance = dist;
                    closestDriver = driver;
                }
            }
        }
        if (!closestDriver) {
            return res.status(404).json({message: 'No drivers found'});
        }
        
        //assign delivery
        const delivery = new Delivery({
            orderId,
            driverId: closestDriver._id,
            restaurantLocation,
            customerLocation,
            status: 'Assigned'
        });

        await delivery.save();

        closestDriver.isAvailable = false;
        await closestDriver.save();

        res.status(201).json({message: `Delivery assigned to ${closestDriver.name}`, delivery});
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
};

module.exports = {
    calculateDistance,
    assignDelivery,
};