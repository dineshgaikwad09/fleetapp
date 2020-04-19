const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let VehicleDetailsSchema = new Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
      },
    makemodel: {type: String, max: 100},
    vin: {type: Number},
    type: {type: String},
    location: {type: String},
    cylinders: {type: Number},
    fueltype: {type: String},
    miles: {type: Number},
    saledate: {type: Date},
    saletype: {type: String},
    openrecall: {type: String},
});


// Export the model
module.exports = mongoose.model('VehicleDetails', VehicleDetailsSchema);