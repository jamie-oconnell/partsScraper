const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

var alldata = {};

function LoginAndProceed() {
    const loginURL = 'http://www.valueparts.com.au/login'

    var options = {
        url: loginURL,
        headers: { 'User-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0' },
        jar: true,
        followAllRedirects: true,
        form: {
            email: "",
            password: ""
        }
    };

    request.post(options, function (error, response, body) {

        printLoggedInUserName(body, '1 ');

        getValuePartsData();

    });
}

function printLoggedInUserName(body, customMessge) {

    let $ = cheerio.load(body);
    let loginDiv = $('#welcome');
    console.log(customMessge + $(loginDiv).text() + '\n');
}

function getValuePartsData() {
    return new Promise(async resolve => {

        const baseURL = 'http://www.valueparts.com.au/parts-by-model/';

        const targets = ['apple-iphone-parts/iphone-8-parts', "apple-iphone-parts/iphone-8-plus-parts", "apple-iphone-parts/iphone-se-parts", "apple-iphone-parts/iphone-x-parts", "apple-iphone-parts/iphone-4-parts", "apple-iphone-parts/iphone-4s-parts", "apple-iphone-parts/iphone-5-parts", "apple-iphone-parts/iphone-5c-parts", "apple-iphone-parts/iphone-5s-parts", "apple-iphone-parts/iphone-6-4-7-inch-parts", "apple-iphone-parts/iphone-6-plus-5-5-inch-parts", "apple-iphone-parts/iphone-6s-4-7-inch-parts", "apple-iphone-parts/iphone-6s-plus-5-5-inch-parts", "apple-iphone-parts/iphone-7-parts", "apple-iphone-parts/iphone-7-plus-parts", "samsung-parts/samsung-galaxy-s7"];

        const urls = targets.map((el) => {
            return baseURL + el;
        });

        const request_data = (url, categoryid, id) => {
            return new Promise(resolve => {

                let getOptions = {
                    url: url,
                    headers: { 'User-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0' },
                    jar: true,
                    followAllRedirects: true,

                };

                request.get(getOptions, (error, responce, html) => {
                    const productdata = [];
                    if (!error) {
                        const $ = cheerio.load(html);
                        const allitems = $('div.related-box');
                        allitems.each(function (index) {
                            productdata.push({
                                'product_name': $(this).find('.name').find('a').text(),
                                'price': $(this).find('.price').children().remove().end().text().replace(/(\r\n|\n|\r)/gm, '').trim(),
                                "product_url": $(this).find('.name').find('a').attr('href')
                            });
                        });
                        if (!(categoryid in alldata)) {
                            alldata[categoryid] = {};
                        }
                        alldata[categoryid][id] = productdata;

                        printLoggedInUserName(html, 'for url ' + url + ' ');

                        return resolve();
                    }
                });
            });
        };

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const urlsplit = targets[i].split('/');
            const categoryid = urlsplit[0];
            const id = urlsplit[1];
            await request_data(url, categoryid, id);
        }

        fs.writeFile('ValueParts.json', JSON.stringify(alldata, null, 2), 'utf8', () => {
            console.log('Data Saved');

            // Pass data to the parameter as bellow
            return resolve(alldata);
        });

    });
}

LoginAndProceed();
