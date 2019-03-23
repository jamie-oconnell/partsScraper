const request = require("request");
const cheerio = require("cheerio");
const crypto = require("crypto");

const Product = require("../models/Product");
const Source = require("../models/Source");
const PriceHistory = require("../models/PriceHistory");

async function getHitechPartsData() {
    console.log("Started Scraping");
    return new Promise(async (resolve, reject) => {
        const baseURL = "http://hitechparts.com.au/product-category/";

        const request_data = async url => {
            return new Promise((resolve, reject) => {
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
                const allitems = $(".products-grid .item");
                let nextUrl;

                if (
                    $(".woocommerce-pagination").length == 1 &&
                    $(".next").length == 1
                ) {
                    nextUrl = $(".next").attr("href");
                }
                let newProducts = [];
                allitems.each(function() {
                    const productUrl = $(this)
                        .find(".item-title")
                        .find("a")
                        .attr("href");
                    const urlHash = crypto
                        .createHash("md5")
                        .update(productUrl)
                        .digest("hex");

                    const product = {
                        product_name: $(this)
                            .find(".item-title")
                            .find("a")
                            .text()
                            .replace(/(\r\n|\n|\r)/gm, "")
                            .trim(),
                        product_category: categoryid,
                        product_url: productUrl,
                        url_hash: urlHash,
                        current_price: $(this)
                            .find(".price-box")
                            .text()
                            .replace(/(\r\n|\n|\r)/gm, "")
                            .trim(),
                        supplier: "hitechparts"
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
                    resolve(nextUrl);
                })();
            });
        };

        const scrape = async () => {
            return new Promise((resolve, reject) => {
                Source.find()
                    .then(async result => {
                        for (const item of result) {
                            const go = async (url, categoryid) => {
                                const data = await request_data(url);
                                const processed_result = await process_data(
                                    data,
                                    categoryid
                                );
                                if (processed_result !== undefined) {
                                    await go(processed_result, categoryid);
                                }
                            };

                            await go(
                                baseURL + item.hitechparts_url,
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

module.exports = getHitechPartsData;
