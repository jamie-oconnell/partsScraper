const express = require('express');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const index = require('./routes/index');

AWS.config.update({
    accessKeyId: "AKIAI7OYWRPA6RFQNRWQ",
    secretAccessKey: "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"
  });

const app = express();

var alldata = {};
var sourcesData = {};
var supplierArray = ['valueparts','hitechparts','jstech','mobilehq'];
var fileArray = {'valueparts':'ValueParts.json','hitechparts':'HitechParts.json','jstech':'JstechParts.json','mobilehq':'Mobilehq.json'};

app.use('/', index);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const model = require('./models');
app.get('/api/update', model.update);
app.get('/api/update/:supplier', model.update);
app.get('/api/sources', sources);
app.get('/api/:supplier', supplier);
app.get('/api/:supplier/:category', supplierfilter);
app.get('/api/:supplier/:category/:id', supplierfilterspecific);

// new AWS.S3().getObject({ Bucket: "supplier-json-files", Key: "source.json" }, function(err, data)
// {
//     if (!err)
//          sourcesData = JSON.parse(data);
//     if (err){
//         console.log(err)
//     }
// });

// fs.readFile('source.json', (err, data) => {
//     if (err) {
//         throw err;
//     }
//     sourcesData = JSON.parse(data);
// });

function sources (req, res){
    new AWS.S3().getObject({ Bucket: "supplier-json-files2", Key: "source.json" }, function(err, data)
    {
        if (!err)
            var sourcesData = JSON.parse(data.Body);
            res.send(sourcesData);
        if (err){
            console.log(err)
        }
    });
  };



function readSupplireDataFile(supplier){
        console.log('supplier name '+supplier);

	let fileName = fileArray[supplier];
        console.log('filename '+fileName);

    return new Promise(async resolve => {

	try{
		new AWS.S3().getObject({ Bucket: "supplier-json-files2", Key: fileName }, function(err, data)
        {
            if (!err)
                alldata[supplier] = JSON.parse(data.Body);
                return resolve();
            if (err){
                console.log(err)
            }
        });;
		
	}catch(e){

	  console.log("Can not read "+fileName+" file");
	}
});
}

async function supplier (req, res){
  
  await readSupplireDataFile(req.params.supplier);
  try {
      res.send({data:alldata[req.params.supplier]['data'],meta_data:alldata[req.params.supplier]['meta_data']});
  }
  catch (e) {
      res.send({data:e.toString()});
  }
};

async function supplierfilter (req, res){

    await readSupplireDataFile(req.params.supplier);
    var categoryid = decodeURI(req.params.category);
    
    if(req.params.supplier!=undefined &&  supplierArray.indexOf(req.params.supplier)>-1){

      try {
	   
          res.send({data:alldata[req.params.supplier]['data'][categoryid],meta_data:alldata[req.params.supplier]['meta_data']});
      }catch (e) {
          res.send({data:e.toString()});
      }

    }

};



async function supplierfilterspecific(req, res){

  await readSupplireDataFile(req.params.supplier);
  var categoryid = req.params.category;
  var id = decodeURI(req.params.id);

    if(req.params.supplier!=undefined && supplierArray.indexOf(req.params.supplier)>-1){

      try {
          res.send({data:alldata[req.params.supplier]['data'][categoryid][id],meta_data:alldata[req.params.supplier]['meta_data']});

      }catch (e) {
          res.send({data:e.toString()});
      }

    }

}



var port = process.env.PORT || 3344;
// app.listen(port, function(){
//     console.log('Server is running on port:', port);
    
// });

// start the server
const server = app.listen(port);

// increase the timeout to 4 minutes
server.timeout = 0; 

module.exports = app;
