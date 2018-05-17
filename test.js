const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

var alldata = {};

function getHiTechPartsData() {
    // return new Promise(async resolve => {

        const baseURL = 'http://hitechparts.com.au/product-category//';

        const targets = ["apple/iphone/iphone-6/"];

        const urls = targets.map((el) => {
            return baseURL + el;
        });

        const request_data = (url) => {
            // return new Promise(resolve => {

                request.get( url, (error, responce, html) => {
                    const productdata = [];
                    if (!error) {
                        const $ = cheerio.load(html);
                        const allitems = $('ul.products-grid');
                        allitems.each(function (index) {
                            productdata.push({
                                'product_name': $(this).find('.item-title').find('a').text().replace(/(\r\n|\n|\r)/gm, '').trim()
                                // 'price': $(this).find('.price').children().remove().end().text().replace(/(\r\n|\n|\r)/gm, '').trim(),
                                // "product_url" : $(this).find('.name').find('a').attr('href')
                            });
                        });
                        // if (!(categoryid in alldata)) {
                        //     alldata[categoryid] = {};
                        // }
                        // alldata[categoryid][id] = productdata;

			//debug
			// printLoggedInUserName(html, 'for url '+url+' ');
                        console.log (productdata);
                    }
                });
            
        };

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            // const urlsplit = targets[i].split('/');
            // const categoryid = urlsplit[0];
            // const id = urlsplit[1];
            request_data(url);

        }
    }

        // fs.writeFile('ValueParts.json', JSON.stringify(alldata, null, 2), 'utf8', () => {
        //     console.log('Data Saved');

        //     // Pass data to the parameter as bellow
        //     return resolve(alldata);
        // });


// function LoginAndProceed(){

// return new Promise(resolve =>{
// 	const loginURL = 'http://www.valueparts.com.au/login'

// 	var options = {
// 			url: loginURL,
// 			headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
// 			jar: true,
// 			followAllRedirects: true,
// 			form: {
// 			email:"dayonezero@gmail.com",
// 			password:"password"
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



// exports.update = async (req, res) => {
//     const data =  await LoginAndProceed();
//     res.send({ data });
// };

getHiTechPartsData();