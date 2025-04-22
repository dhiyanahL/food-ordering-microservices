const Cart = require('../models/CartSchema');

exports.addItem = async(req , res)=>{


    try{

        const {item} = req.body;
        let totalAmount = 0;

        for(const cartItem of item){

            totalAmount += cartItem.price * cartItem.quantity;
        }
      


 
         const newCartItems = new Cart({
    
            item,
            totalAmount
    
          
    
        });
    
        const result = await newCartItems.save();
        if(!result) return res.status(404).json({message : "Error Occured In saving Items ⚠️"});
        res.status(201).json({message : "Items Saved Successfully 🎉"});
    }catch(message){


        console.log(message);
        res.status(500).json({message : "Server Error Occurred 🔏"});


    }




}


exports.deleteItem = async(req, res)=>{

    


}