const request = require("request");
const cheerio = require("cheerio");
var moment = require("moment");

const Product = require("../models/Product");

// function getMobilehqData() {

//         const baseURL = 'https://www.mobilehq.com.au/shop/by-brand/';

//         const request_data = (url, categoryid, id) => {

//                 let getOptions = {
//                     url: url,
//                     headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
//                     jar: true,
//                     followAllRedirects: true,

//                 };

//                 request.get(getOptions, (error, responce, html) => {

//                     let productdata = {};

//                     if ((categoryid in alldata)) {

//                         if((id in alldata[categoryid])){
//                             productdata = alldata[categoryid][id];
// 						}
//                     }

//                     if (!error) {
//                         const $ = cheerio.load(html);
//                         const allitems = $('.products-grid li');

//                         allitems.each(function (index) {

//                             let productUrl = $(this).find('.product-name').find('a').attr('href');
//                             let productUrlHash = crypto.createHash('md5').update(productUrl).digest("hex");
//                             var priceWithCurrncy = $(this).find('.price-box').find('.price').text().replace(/(\r\n|\n|\r)/gm, '').trim();
//                             let priceValue = priceWithCurrncy.split("$")[1];

//                             var oldPrice = priceWithCurrncy;
//                             var oldPriceValue = priceValue;
//                             var diff = '0.00';
//                             var isChanged = false;

//                             if(lastResponse[categoryid] != undefined && lastResponse[categoryid][id] != undefined){

//                                 if(lastResponse[categoryid][id][productUrlHash]!=undefined){

//                                     var lastResponseRecord = lastResponse[categoryid][id][productUrlHash];
//                                     oldPrice = lastResponseRecord.price;
//                                     oldPriceValue = lastResponseRecord.price_value;

//                                     diff = Number(priceValue)-Number(oldPriceValue);
//                                     if(diff!='0.00'){
//                                         isChanged = true;
//                                     }

//                                 }

//                             }

//                             productdata[productUrlHash] ={
//                                 'product_name': $(this).find('.product-name').find('a').attr('title').replace(/(\r\n|\n|\r)/gm, '').trim(),
//                                 'price': priceWithCurrncy,
//                                 'price_value': priceValue,
//                                 "product_url" : productUrl,
//                                 'old_price': oldPrice,
//                                 'old_price_value': oldPriceValue,
//                                 'is_changed':isChanged,

//                                 'diff': diff
//                             };

//                         });

//                         if (!(categoryid in alldata)) {
//                             alldata[categoryid] = {};
//                         }
//                         alldata[categoryid][id]= productdata;

//                         if($('.pages').length==2 && $('.next.i-next').length==2){

//                             const nextUrl = $(".next.i-next").attr('href');
//                             return resolve(nextUrl);

// 			}
// 			else {
//                             return resolve();

//                         }
//                     }
//                 });
//             }

//         var supplierTargets = await getTargetsForSupplier();

//         try{
//             let rawdata =  await readFileFromS3('last_mobilehq.json');
//             lastResponse = JSON.parse(rawdata).data;
//         }
//         catch(err){

//         }

//         console.log(supplierTargets);

//         for(let categoryid in supplierTargets){

//             let idArray = supplierTargets[categoryid];

//             for(let id in idArray){

//                 if(idArray[id]['mobilehq_url']!=undefined && idArray[id]['mobilehq_url']!=''){

//                     console.log("processing "+baseURL+idArray[id]['mobilehq_url'], categoryid, id);

//                     let nextUrl = await request_data(baseURL+idArray[id]['mobilehq_url'], categoryid, id);

//                     while (nextUrl!=undefined){
//                         console.log("processing "+baseURL+idArray[id]['mobilehq_url'], categoryid, id);
//                         nextUrl = await request_data(nextUrl, categoryid, id);
//                     }
//                 }

//             }
//         }

// 	let dataToWirte = {data:alldata,meta_data:{last_update:moment().format('Y-M-D:hh:mm:ss')}};

//         console.log(dataToWirte)

//     };

// function getJstechData() {
//     var alldata = {};
//     var lastResponse = {};
//     return new Promise(async resolve => {

//         const baseURL = 'https://jstech.com.au/';

//         const request_data = (url, categoryid, id) => {
//             return new Promise(resolve => {

//                 let getOptions = {
//                     url: url,
//                     headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
//                     jar: true,
//                     followAllRedirects: true,

//                 };

//                 request.get(getOptions, (error, responce, html) => {

//                     let productdata = {};

//                     if ((categoryid in alldata)) {

//                         if((id in alldata[categoryid])){
//                             productdata = alldata[categoryid][id];
//                         }
//                     }

//                     if (!error) {
//                         const $ = cheerio.load(html);
//                         const allitems = $('#productsRow div.col-md-2');

//                         allitems.each(function (index) {

//                             let productUrl = $(this).find('#desk-img-phone').find('a').attr('href');
//                             let productUrlHash = crypto.createHash('md5').update(productUrl).digest("hex");
//                             var priceWithCurrncy = $(this).find('.price-new').text().replace(/(\r\n|\n|\r)/gm, '').trim();
//                             let public_price = $(this).find('.price-old').text().replace(/(\r\n|\n|\r)/gm, '').trim();
//                             if (priceWithCurrncy == ""){
//                                 public_price = $(this).find('.desk-img-desc').children().last().text().replace(/(\r\n|\n|\r)/gm, '').trim();
//                                 priceWithCurrncy = $(this).find('.desk-img-desc').children().last().text().replace(/(\r\n|\n|\r)/gm, '').trim();
//                             }
//                             let priceValue = priceWithCurrncy.split("$")[1];
//                             var oldPrice = priceWithCurrncy;
//                             var oldPriceValue = priceValue;
//                             var diff = '0.00';
//                             var isChanged = false;

//                             if(lastResponse[categoryid] != undefined && lastResponse[categoryid][id] != undefined){

//                                 if(lastResponse[categoryid][id][productUrlHash]!=undefined){

//                                     var lastResponseRecord = lastResponse[categoryid][id][productUrlHash];
//                                     oldPrice = lastResponseRecord.price;
//                                     oldPriceValue = lastResponseRecord.price_value;

//                                     diff = Number(priceValue)-Number(oldPriceValue);
//                                     if(diff!='0.00'){
//                                         isChanged = true;
//                                     }

//                                 }

//                             }

//                             productdata[productUrlHash] ={
//                                 'product_name': $(this).find('.desk-img-desc').find('a').text().replace(/(\r\n|\n|\r)/gm, '').trim(),
//                                 'price': priceWithCurrncy,
//                                 'price_value': priceValue,
//                                 'public_price': public_price,
//                                 "product_url" : productUrl,
//                                 'old_price': oldPrice,
//                                 'old_price_value': oldPriceValue,
//                                 'is_changed':isChanged,
//                                 'diff': diff
//                             };

//                         });

//                         if (!(categoryid in alldata)) {
//                             alldata[categoryid] = {};
//                         }
//                         alldata[categoryid][id]= productdata;

//                         if($('.load_more_btn').length==1 ){

//                             return resolve(true);

//                         }
//                         else {
//                             return resolve(false);

//                         }
//                     }
//                 });
//             });
//         };
//         const request_data_from_JS_API = (url, categoryid, id) => {
//             return new Promise(resolve => {

//                 let getOptions = {
//                     url: url,
//                     headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
//                     jar: true,
//                     followAllRedirects: true,

//                 };

//                 request.get(getOptions, (error, responce, html) => {

//                     let productdata = {};

//                     if ((categoryid in alldata)) {

//                         if((id in alldata[categoryid])){
//                             productdata = alldata[categoryid][id];
//                         }
//                     }

//                     let resData = JSON.parse(responce.body);
//                     const allitems = resData.products;

//                     if (allitems.length>0) {

//                         for(let item of allitems){

//                             let productUrl = item.href.split("?")[0];
//                             let productUrlHash = crypto.createHash('md5').update(productUrl).digest("hex");

//                             var priceWithCurrncy = item.price;
//                             if(item.special!=undefined){
//                                 priceWithCurrncy = item.special;
//                             }
// 			    else{
// 				priceWithCurrncy = item.price;
// 			    }
//                             let priceValue = priceWithCurrncy+''.split("$")[1];
//                             let public_price = item.price;
//                             var oldPrice = priceWithCurrncy;
//                             var oldPriceValue = priceValue;
//                             var diff = '0.00';
//                             var isChanged = false;

//                             if(lastResponse[categoryid] != undefined && lastResponse[categoryid][id] != undefined){

//                                 if(lastResponse[categoryid][id][productUrlHash]!=undefined){

//                                     var lastResponseRecord = lastResponse[categoryid][id][productUrlHash];
//                                     oldPrice = lastResponseRecord.price;
//                                     oldPriceValue = lastResponseRecord.price_value;

//                                     diff = Number(priceValue)-Number(oldPriceValue);
//                                     if(diff!='0.00'){
//                                         isChanged = true;
//                                     }

//                                 }

//                             }

//                             productdata[productUrlHash] ={
//                                 'product_name': item.name,
//                                 'price': priceWithCurrncy,
//                                 'price_value': priceValue,
//                                 'public_price' : public_price,
//                                 "product_url" : productUrl,
//                                 'old_price': oldPrice,
//                                 'old_price_value': oldPriceValue,
//                                 'is_changed':isChanged,
//                                 'diff': diff
//                             };

//                         }

//                         if (!(categoryid in alldata)) {
//                             alldata[categoryid] = {};
//                         }
//                         alldata[categoryid][id]= productdata;

//                             return resolve(true);

//                     }
//                     else {
//                         return resolve(false);
//                     }

//                 });
//             });
//         };

//         var supplierTargets = await getTargetsForSupplier();

//         try{
//             let rawdata = await readFileFromS3('last_jstech.json');
//             lastResponse = JSON.parse(rawdata).data;
//         }
//         catch(err){

//         }

//         console.log(supplierTargets);

//         for(let categoryid in supplierTargets){

//             let idArray = supplierTargets[categoryid];

//             for(let id in idArray){

//                 if(idArray[id]['jstech_url']!=undefined && idArray[id]['jstech_url']['url']!=undefined){
//                     console.log("processing "+baseURL+idArray[id]['jstech_url']['url'], categoryid, id);

//                     let nextUrl = await request_data(baseURL+idArray[id]['jstech_url']['url'], categoryid, id);
//                     if(nextUrl){

//                         let apiPathId = idArray[id]['jstech_url']['path'];
//                         let currentPageId = 2;
//                         let apiUrl = baseURL+'?route=product/category&path='+apiPathId+'&page='+currentPageId+'&sort=null&order=null&ajax=1';

//                         let nextApicall = true;

//                         while (nextApicall!=false && apiPathId != ''){

//                             apiUrl = baseURL+'?route=product/category&path='+apiPathId+'&page='+currentPageId+'&sort=null&order=null&ajax=1';
//                             console.log("api processing "+apiUrl, categoryid, id);
//                             nextApicall = await request_data_from_JS_API(apiUrl,categoryid, id);
//                             currentPageId++;
//                         }

//                     }

//                 }

//             }
//         }

// 	let dataToWirte = {data:alldata,meta_data:{last_update:moment().format('Y-M-D:hh:mm:ss')}};
//         fs.writeFile('JstechParts.json', JSON.stringify(dataToWirte, null, 2), 'utf8', () => {
//             console.log('Data Saved');
//             uploadtoS3('JstechParts.json')

//             fs.writeFile('last_jstech.json', JSON.stringify(dataToWirte, null, 2), 'utf8', () => {
//                 console.log('Old Data Saved');
//                 uploadtoS3('last_jstech.json')

//                 console.log(alldata);
//                 return resolve(dataToWirte);
//             });

//         });

//     });

// }



getHitechPartsData();

// function getValuePartsData() {
//     var alldata = {};
//     var lastResponse = {};

//     return new Promise(async resolve => {

//         const baseURL = 'http://www.valueparts.com.au/parts-by-model/';

//         const request_data = (url, categoryid, id) => {
//             return new Promise(resolve => {

// 		let getOptions = {
// 		url: url,
// 		headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
// 		jar: true,
// 		followAllRedirects: true,

// 		};

//                 request.get(getOptions, (error, responce, html) => {
//                     const productdata = {};
//                     if (!error) {
//                         const $ = cheerio.load(html);
//                         const allitems = $('div.related-box');
//                         allitems.each(function (index) {

// 			    let productUrl = $(this).find('.name').find('a').attr('href');
// 			    let productUrlHash = crypto.createHash('md5').update(productUrl).digest("hex");
//                 var priceWithCurrncy = $(this).find('.price').find('.price-new').text();
//                 let priceValue = priceWithCurrncy.split("$")[1];
//                 var publicPrice = $(this).find('.price').find('.price-old').text();
// 			    var oldPrice = priceWithCurrncy;
// 			    var oldPriceValue = priceValue;
// 			    var diff = '0.00';
// 			    var isChanged = false;

//                             if(lastResponse[categoryid] != undefined && lastResponse[categoryid][id] != undefined){

// 					if(lastResponse[categoryid][id][productUrlHash]!=undefined){

// 					var lastResponseRecord = lastResponse[categoryid][id][productUrlHash];
// 					oldPrice = lastResponseRecord.price;
// 					oldPriceValue = lastResponseRecord.price_value;
// 					diff = Number(priceValue)-Number(oldPriceValue);
// 					if(diff!='0.00'){
// 						isChanged = true;
// 					}

// 				    }

// 			    }

// 			    productdata[productUrlHash] ={
//                                 'product_name': $(this).find('.name').find('a').text(),
//                                 'price': priceWithCurrncy,
//                 'price_value': priceValue,
//                 "public_price" : publicPrice,
//                                 "product_url" : productUrl,
// 				'old_price': oldPrice,
// 				'old_price_value': oldPriceValue,
// 				'is_changed':isChanged,
// 				'diff': diff
//                             };

//                         });
//                         if (!(categoryid in alldata)) {
//                             alldata[categoryid] = {};
//                         }
//                         alldata[categoryid][id] = productdata;

// 			printLoggedInUserName(html, 'for url '+url+' ');
//                         return resolve();
//                     }
//                 });
//             });
//         };

//         try{
//             let rawdata = readFileFromS3('last.json').then(
//             lastResponse = JSON.parse(rawdata).data);
//         }
//         catch(err){

//         }

//         var supplierTargets = await getTargetsForSupplier();

//         console.log(supplierTargets);

//         for(let categoryid in supplierTargets){

// 			let idArray = supplierTargets[categoryid];

// 			for(let id in idArray){

// 			    if(idArray[id]['valueparts_url']!=undefined && idArray[id]['valueparts_url']!=''){
//                     console.log(baseURL+idArray[id]['valueparts_url'], categoryid, id);
//                     await request_data(baseURL+idArray[id]['valueparts_url'], categoryid, id);
//                 }

// 			}
// 	}

// 	let dataToWirte = {data:alldata,meta_data:{last_update:moment().format('Y-M-D:hh:mm:ss')}};
//         fs.writeFile('ValueParts.json', JSON.stringify(dataToWirte, null, 2), 'utf8', () => {
//             console.log('Data Saved');
//             uploadtoS3('ValueParts.json')

// 	    fs.writeFile('last.json', JSON.stringify(dataToWirte, null, 2), 'utf8', () => {
//             console.log('Old Data Saved');
//             uploadtoS3('last.json')

//             return resolve(dataToWirte);
//        	   });

//         });

//     });
// }

// function LoginAndProceed(){

// 	return new Promise(resolve =>{

// 	const loginURL = 'http://www.valueparts.com.au/login'

// 	var options = {
// 			url: loginURL,
// 			headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
// 			jar: true,
// 			followAllRedirects: true,
// 			form: {
// 			email:"",
// 			password:""
// 			}
// 	};

// 	request.post(options,function(error, response, body) {

// 		printLoggedInUserName(body,'1 ');

// 		return resolve(getValuePartsData());

// 	});

// });
// }

// function printLoggedInUserName(body,customMessge){

// 	let $ = cheerio.load(body);
// 	let loginDiv = $('#welcome');
// 	console.log(customMessge+$(loginDiv).text()+'\n');
// }

// async function getTargetsForSupplier(){

// 	try{
//         let rawData = await readFileFromS3(pathToSourceJson);
//         return (rawData);
// 	}
// 	catch(err){
// 	    console.log(err);
// 	    console.log('cant read source json file');
// 	}

// }

// function LoginToJs(){

//     return new Promise(resolve =>{

//     const EMAIL = '';
//     const PASSWORD = '';
//     const loginURL = 'https://jstech.com.au/?route=account/login&ajax=1'

//     var options = {
//     url: loginURL,
//     headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
//     jar: true,
//     followAllRedirects: true,
//     form: {
//     email:EMAIL,
//     password:PASSWORD
//     }
//     };

//     request.post(options,function(error, response, body) {

//     return resolve(getJstechData());

//     });

//     });
// }

// function LoginToMobilehq(){

//     return new Promise(resolve =>{

//     const EMAIL = '';
//     const PASSWORD = '';
//     const loginPageURL = 'https://www.mobilehq.com.au/customer/account/login';
//     const loginURL = 'https://www.mobilehq.com.au/customer/account/loginPost/'

//     request.get(loginPageURL,function(error, response, body){

// 	let $ = cheerio.load(body);
// 	const formKey = $('input[name="form_key"]').attr('value');

//         var options = {
// 	    url: loginURL,
// 	    headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
// 	    jar: true,
// 	    followAllRedirects: true,
// 	    form: {
// 	    login:{'username':EMAIL,'password':PASSWORD,'rememberme': "on"},
// 	    send: "",
// 	    form_key: formKey
// 		 }
// 	    };

//       request.post(options,function(error, response, body) {

//     	return resolve(getMobilehqData());

//     	});

//     });

// });
// }

// exports.update = async (req, res) => {

//     var supplier = req.params.supplier;
//     var data = {};
//     switch(supplier){
// 	case 'valueparts':
// 	  data =  await LoginAndProceed();
// 	break;
// 	case 'hitechparts':
// 	  data =  await getHitechPartsData();
// 	break;
// 	case 'jstech':
// 	  data =  await LoginToJs();
// 	break;
// 	case 'mobilehq':
//           data = await LoginToMobilehq();
//         break;
// 	case undefined:
// 	  data = 'No sup prrovide';
// 	break;
//    }

//     res.send({ data });
// };
