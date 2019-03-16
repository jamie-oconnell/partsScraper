const request = require("request");
const cheerio = require("cheerio");
const crypto = require("crypto");

const Product = require("../models/Product");
const Source = require("../models/Source");

const loginDetails = require("../config/keys").valuepartslogin;

function getValuePartsData() {
    const baseURL = "http://www.valueparts.com.au/parts-by-model/";

    const request_data = (url, categoryid) => {
        let getOptions = {
            url: url,
            headers: {
                "User-agent":
                    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0"
            },
            jar: true,
            followAllRedirects: true
        };

        request.get(getOptions, (error, responce, html) => {
            if (error) {
                console.log(error);
            }
            if (!error) {
                const $ = cheerio.load(html);
                const allitems = $("div.related-box");
                allitems.each(function() {
                    const productUrl = $(this)
                        .find(".name")
                        .find("a")
                        .attr("href");
                    const urlHash = crypto
                        .createHash("md5")
                        .update(productUrl)
                        .digest("hex");

                    const product = {
                        product_name: $(this)
                            .find(".name")
                            .find("a")
                            .text(),
                        product_category: categoryid,
                        product_url: productUrl,
                        url_hash: urlHash,
                        current_price: $(this)
                            .find(".price")
                            .find(".price-new")
                            .text(),
                        supplier: "valueparts"
                    };

                    Product.findOneAndUpdate({ url_hash: urlHash }, product, {
                        upsert: true,
                        returnNewDocument: true
                    })
                        .then(updatedDoc => {
                            console.log(updatedDoc);
                        })
                        .catch(err => console.log(err));
                });
            }
        });
    };
    Source.find()
        .then(result => {
            for (const item of result) {
                request_data(baseURL + item.valueparts_url, item.category);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = getValuePartsData;

function Login() {
    return new Promise(resolve => {
        const loginURL = "http://www.valueparts.com.au/login";

        var options = {
            url: loginURL,
            headers: {
                "User-agent":
                    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0"
            },
            jar: true,
            followAllRedirects: true,
            form: {
                email: loginDetails.email,
                password: loginDetails.password
            }
        };

        request.post(options, function(error, response, body) {
            let $ = cheerio.load(body);
            let loginDiv = $("#welcome");
            console.log($(loginDiv).text() + "\n");

            return resolve();
        });
    });
}
