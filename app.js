const express = require('express');
const path = require('path');
const fs = require('fs');

const index = require('./routes/index');

const app = express();

var alldata = {};
var supplierArray = ['valueparts','hitechparts','jstech'];

app.use('/', index);

const model = require('./models');
app.get('/api/update', model.update);
app.get('/api/update/:supplier', model.update);
app.get('/api/:supplier', supplier);
app.get('/api/:supplier/:category', supplierfilter);
app.get('/api/:supplier/:category/:id', supplierfilterspecific);



fs.readFile('ValueParts.json', (err, data) => {
  if (err) {
      throw err;
  }
  alldata[supplierArray[0]] = JSON.parse(data);
});
fs.readFile('HitechParts.json', (err, data) => {
  if (err) {
      throw err;
  }
  alldata[supplierArray[1]] = JSON.parse(data);
});
fs.readFile('JstechParts.json', (err, data) => {
  if (err) {
      throw err;
  }
  alldata[supplierArray[2]] = JSON.parse(data);
});

function supplier (req, res){

  try {
      res.send({data:alldata[req.params.supplier]});
  }
  catch (e) {
      res.send({data:e.toString()});
  }
};

function supplierfilter (req, res){

    var categoryid = decodeURI(req.params.category);
    
    if(req.params.supplier!=undefined &&  supplierArray.indexOf(req.params.supplier)>-1){

      try {
          res.send({data:alldata[req.params.supplier][categoryid]});
      }catch (e) {
          res.send({data:e.toString()});
      }

    }



};

function supplierfilterspecific(req, res){

  var categoryid = req.params.category;
  var id = decodeURI(req.params.id);

    if(req.params.supplier!=undefined && supplierArray.indexOf(req.params.supplier)>-1){

      try {
          res.send({data:alldata[req.params.supplier][categoryid][id]});

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
