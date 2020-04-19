const VehicleDetails = require('../models/vehicledetails.model');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');


const s3 = new AWS.S3({
  accessKeyId: 'AKIAJDXJAKI4QK7XMHWA',
  secretAccessKey: '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',
  sslEnabled: true
});

// testconst multer = require('multer'); // file storing middleware
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
    
    const fileName = '6AFFFI20707013.jpg';
    
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
            openrecall: req.body.openrecall,
            filename: fileName
        }
    );

    vehicleDetails.save(function (err) {
        if (err) {
            //return next(err);
            res.send('Error '+ err)
        }
        
        fs.readFile(fileName, (err, data) => {
            if (err) throw err;
            const params = {
                Bucket: 'fleet-vehicles', // pass your bucket name
                Key: '6AFFFI20707013.jpg', // file will be saved as testBucket/contacts.csv
                Body: JSON.stringify(data, null, 2)
            };
            s3.upload(params, function(s3Err, data) {
                if (s3Err) throw s3Err
                console.log(`File uploaded successfully at ${data.Location}`)
            });
         });
    
         res.sendFile(path.join(path.normalize(__dirname +'/..')+'/views/vehicleDetailsSuccess.html'));
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