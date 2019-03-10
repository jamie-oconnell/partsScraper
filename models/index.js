const request = require("request");
const cheerio = require("cheerio");
var moment = require("moment");

const Product = require("../models/Product");

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
