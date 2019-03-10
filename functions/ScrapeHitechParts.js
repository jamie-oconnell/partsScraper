const request = require("request");
const cheerio = require("cheerio");
const crypto = require("crypto");

const Product = require("../models/Product");
const Source = require("../models/Source");

function getHitechPartsData() {
    const baseURL = "http://hitechparts.com.au/product-category/";

    const request_data = (url, categoryid) => {
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
                const $ = cheerio.load(html);
                const allitems = $(".products-grid .item");

                allitems.each(function() {
                    const productUrl = $(this)
                        .find(".item-title")
                        .find("a")
                        .attr("href");
                    const urlHash = crypto
                        .createHash("md5")
                        .update(
                            $(this)
                                .find(".item-title")
                                .find("a")
                                .attr("href")
                        )
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

                    Product.findOneAndUpdate({ url_hash: urlHash }, product, {
                        upsert: true,
                        returnNewDocument: true
                    })
                        .then(updatedDoc => {
                            console.log(updatedDoc);
                        })
                        .catch(err => console.log(err));
                });

                if (
                    $(".woocommerce-pagination").length == 1 &&
                    $(".next").length == 1
                ) {
                    const nextUrl = $(".next").attr("href");
                    return request_data(nextUrl);
                }
            }
        });
    };

    Source.find()
        .then(result => {
            for (const item of result) {
                request_data(baseURL + item.hitechparts_url, item.category);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = getHitechPartsData;
