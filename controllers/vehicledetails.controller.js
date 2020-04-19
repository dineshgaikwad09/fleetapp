const VehicleDetails = require('../models/vehicledetails.model');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');


const s3 = new AWS.S3({
  accessKeyId: 'AKIAIF7UZK6TKECVXF6A',
  secretAccessKey: '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',
  sslEnabled: true
});

// const multer = require('multer'); // file storing middleware
// //MULTER CONFIG: to get file photos to temp server storage
// const multerConfig = {
    
//     storage: multer.diskStorage({
//      //Setup where the user's file will go
//      destination: function(req, file, next){
//        next(null, './uploads');
//        },   
        
//         //Then give the file a unique name
//         filename: function(req, file, next){
//             console.log(file);
//             const ext = file.mimetype.split('/')[1];
//             next(null, file.fieldname + '-' + Date.now() + '.'+ext);
//           }
//         }),   
        
//         //A means of ensuring only images are uploaded. 
//         fileFilter: function(req, file, next){
//               if(!file){
//                 next();
//               }
//             const image = file.mimetype.startsWith('image/');
//             if(image){
//               console.log('photo uploaded');
//               next(null, true);
//             }else{
//               console.log("file not supported");
              
//               //TODO:  A better message response to user on failure.
//               return next();
//             }
//         }
//       };

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.insert_vehicle_details = function (req, res) {
    let sampleFile = req.body.photo;
    let vehicleDetails = new VehicleDetails(
        {
            makemodel: req.body.makemodel,
            vin: req.body.vin,
            type: req.body.type,
            location: req.body.location,
            cylinders: req.body.cylinders,
            fueltype: req.body.fueltype,
            miles: req.body.miles,
            saledate: req.body.saledate,
            saletype: req.body.saletype,
            openrecall: req.body.openrecall
        }
    );

    vehicleDetails.save(function (err) {
        if (err) {
            //return next(err);
            res.send('Error '+ err)
        }
        
        var path = req.query.path;
        var type = req.query.type;

        var params = {
            Expires: 60,
            Bucket: "fleet-vehicles",
            ACL: "public-read", // ANY ACL YOU LIKE,
            Key: path,
            ContentType: type
        };

        S3.getSignedUrl("putObject", params, (err, data) => {
            if (err) {
            res.status(500).send({ error: true });
            }
            else {
            res.send({ signedUrl: data })
            }
        });
        res.send('Vehicle details saved successfully')
    })
};

//Get Sepecific Vehicle Details
exports.vehicle_details = function (req, res) {
    VehicleDetails.findById(req.params.id, function (err, vehicle) {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving vehicles."
            });
        }
        res.send(vehicle);
    })
};

// Retrieve and return all vehicles from the database.
exports.get_all_vehicle_details = function (req, res) {
    VehicleDetails.find().
    then((allVehicles) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all vehicles',
        Vehicles: allVehicles,
      });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving vehicles."
        });
    });
};

exports.vehicle_details_view = function (req, res) {
    console.log(path);
    res.sendFile(path.join(path.normalize(__dirname +'/..')+'/views/vehicleDetails.html'));
};

exports.login_view = function (req, res) {
    console.log(path);
    res.sendFile(path.join(path.normalize(__dirname +'/..')+'/public/login.html'));
};