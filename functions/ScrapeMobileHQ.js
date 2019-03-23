const request = require("request");
const cheerio = require("cheerio");
const crypto = require("crypto");

const Product = require("../models/Product");
const Source = require("../models/Source");

const loginDetails = require("../config/keys").mobilehqlogin;

function Login() {
    return new Promise(resolve => {
        const loginPageURL =
            "https://www.mobilehq.com.au/customer/account/login";
        const loginURL =
            "https://www.mobilehq.com.au/customer/account/loginPost/";

        request.get(loginPageURL, function(error, response, body) {
            let $ = cheerio.load(body);
            const formKey = $('input[name="form_key"]').attr("value");

            var options = {
                url: loginURL,
                headers: {
                    "User-agent":
                        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0"
                },
                jar: true,
                followAllRedirects: true,
                form: {
                    "login[username]": loginDetails.email,
                    "login[password]": loginDetails.password,
                    rememberme: "on",

                    // login: {
                    //     username: loginDetails.email,
                    //     password: loginDetails.password,
                    //     rememberme: "on"
                    // },
                    send: "",
                    form_key: formKey
                }
            };

            console.log(options);
            request.post(options, function(error, response, body) {
                console.log(body);
                console.log("Logged in");
                resolve();
            });
        });
    });
}

getMobileHQData = () => {
    Login();
};

module.exports = getMobileHQData;

// async function getValuePartsData() {
//     console.log("Started Scraping");
//     return new Promise(async (resolve, reject) => {
//         const baseURL =
//             "http://www.valueparts.com.au/index.php?_route_=parts-by-model/";
//         const request_data = async url => {
//             return new Promise((resolve, reject) => {
//                 console.log(`Getting data from ${url}`);

//                 let getOptions = {
//                     url: url,
//                     headers: {
//                         "User-agent":
//                             "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0"
//                     },
//                     jar: true,
//                     followAllRedirects: true
//                 };

//                 request.get(getOptions, (error, responce, html) => {
//                     if (error) {
//                         console.log(error);
//                     }
//                     if (!error) {
//                         resolve(html);
//                     }
//                 });
//             });
//         };

//         const process_data = (data, categoryid) => {
//             return new Promise(resolve => {
//                 const $ = cheerio.load(data);
//                 const allitems = $("div.related-box");
//                 let newProducts = [];
//                 allitems.each(function() {
//                     const productUrl = $(this)
//                         .find(".name")
//                         .find("a")
//                         .attr("href");
//                     const urlHash = crypto
//                         .createHash("md5")
//                         .update(productUrl)
//                         .digest("hex");
//                     const product = {
//                         product_name: $(this)
//                             .find(".name")
//                             .find("a")
//                             .text(),
//                         product_category: categoryid,
//                         product_url: productUrl,
//                         url_hash: urlHash,
//                         current_price: $(this)
//                             .find(".price")
//                             .find(".price-new")
//                             .text(),
//                         supplier: "valueparts"
//                     };
//                     newProducts.push(product);
//                 });
//                 (async () => {
//                     for (product of newProducts) {
//                         let updatedDoc = await Product.findOneAndUpdate(
//                             { url_hash: product.url_hash },
//                             product,
//                             {
//                                 upsert: true,
//                                 returnNewDocument: true
//                             }
//                         );
//                         console.log(updatedDoc);
//                     }
//                     resolve();
//                 })();
//             });
//         };

//         const scrape = async () => {
//             return new Promise(async (resolve, reject) => {
//                 await Login();
//                 Source.find()
//                     .then(async result => {
//                         for (const item of result) {
//                             const go = async (url, categoryid) => {
//                                 return new Promise(async resolve => {
//                                     const data = await request_data(url);
//                                     await process_data(data, categoryid);
//                                     resolve();
//                                 });
//                             };

//                             await go(
//                                 baseURL + item.valueparts_url,
//                                 item.category
//                             );
//                         }
//                         resolve();
//                     })
//                     .catch(err => {
//                         reject(err);
//                     });
//             });
//         };
//         await scrape();
//         resolve();
//     });
// }

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

//     // function LoginToMobilehq(){

// //     return new Promise(resolve =>{

// //     const EMAIL = '';
// //     const PASSWORD = '';
// //     const loginPageURL = 'https://www.mobilehq.com.au/customer/account/login';
// //     const loginURL = 'https://www.mobilehq.com.au/customer/account/loginPost/'

// //     request.get(loginPageURL,function(error, response, body){

// // 	let $ = cheerio.load(body);
// // 	const formKey = $('input[name="form_key"]').attr('value');

// //         var options = {
// // 	    url: loginURL,
// // 	    headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
// // 	    jar: true,
// // 	    followAllRedirects: true,
// // 	    form: {
// // 	    login:{'username':EMAIL,'password':PASSWORD,'rememberme': "on"},
// // 	    send: "",
// // 	    form_key: formKey
// // 		 }
// // 	    };

// //       request.post(options,function(error, response, body) {

// //     	return resolve(getMobilehqData());

// //     	});

// //     });

// // });
// // }
