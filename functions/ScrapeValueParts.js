const request = require("request");
const cheerio = require("cheerio");
const crypto = require("crypto");

const Product = require("../models/Product");
const PriceHistory = require("../models/PriceHistory");
const Source = require("../models/Source");

const loginDetails = require("../config/keys").valuepartslogin;

function Login() {
    return new Promise(resolve => {
        const loginURL = "https://www.valueparts.com.au/login";

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
            const result = $(loginDiv).text();
            console.log(result);

            return resolve(result);
        });
    });
}

async function getValuePartsData() {
    console.log("Started Scraping");
    return new Promise(async (resolve, reject) => {
        const baseURL =
            "http://www.valueparts.com.au/index.php?_route_=parts-by-model/";
        const request_data = async url => {
            return new Promise(resolve => {
                console.log(`Getting data from ${url}`);

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
                        resolve(html);
                    }
                });
            });
        };

        const process_data = (data, categoryid) => {
            return new Promise(resolve => {
                const $ = cheerio.load(data);
                const allitems = $("div.related-box");
                let newProducts = [];
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
                    newProducts.push(product);
                });
                (async () => {
                    for (product of newProducts) {
                        let updatedDoc = await Product.findOneAndUpdate(
                            { url_hash: product.url_hash },
                            product,
                            {
                                upsert: true,
                                returnNewDocument: true
                            }
                        );
                        await PriceHistory.update(
                            { url_hash: product.url_hash },
                            {
                                $push: {
                                    priceHistory: {
                                        date: Date.now,
                                        price: product.price
                                    }
                                }
                            },
                            {
                                upsert: true,
                                returnNewDocument: true
                            }
                        );
                        await PriceHistory.updateOne(
                            { url_hash: product.url_hash },
                            {
                                url_hash: product.url_hash,
                                product_name: product.product_name,
                                $addToSet: {
                                    priceHistory: {
                                        date: Date.now(),
                                        price: product.current_price
                                    }
                                }
                            },
                            {
                                upsert: true
                            }
                        );
                    }
                    resolve();
                })();
            });
        };

        const scrape = async () => {
            return new Promise(async (resolve, reject) => {
                await Login();
                Source.find()
                    .then(async result => {
                        for (const item of result) {
                            const go = async (url, categoryid) => {
                                return new Promise(async resolve => {
                                    const data = await request_data(url);
                                    await process_data(data, categoryid);
                                    resolve();
                                });
                            };

                            await go(
                                baseURL + item.valueparts_url,
                                item.category
                            );
                        }
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        };
        await scrape();
        resolve();
    });
}

module.exports = getValuePartsData;
