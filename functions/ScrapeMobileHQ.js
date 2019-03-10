function getMobilehqData() {

        const baseURL = 'https://www.mobilehq.com.au/shop/by-brand/';

        const request_data = (url, categoryid, id) => {

                let getOptions = {
                    url: url,
                    headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
                    jar: true,
                    followAllRedirects: true,

                };

                request.get(getOptions, (error, responce, html) => {

                    let productdata = {};

                    if ((categoryid in alldata)) {

                        if((id in alldata[categoryid])){
                            productdata = alldata[categoryid][id];
						}
                    }

                    if (!error) {
                        const $ = cheerio.load(html);
                        const allitems = $('.products-grid li');

                        allitems.each(function (index) {

                            let productUrl = $(this).find('.product-name').find('a').attr('href');
                            let productUrlHash = crypto.createHash('md5').update(productUrl).digest("hex");
                            var priceWithCurrncy = $(this).find('.price-box').find('.price').text().replace(/(\r\n|\n|\r)/gm, '').trim();
                            let priceValue = priceWithCurrncy.split("$")[1];

                            var oldPrice = priceWithCurrncy;
                            var oldPriceValue = priceValue;
                            var diff = '0.00';
                            var isChanged = false;

                            if(lastResponse[categoryid] != undefined && lastResponse[categoryid][id] != undefined){

                                if(lastResponse[categoryid][id][productUrlHash]!=undefined){

                                    var lastResponseRecord = lastResponse[categoryid][id][productUrlHash];
                                    oldPrice = lastResponseRecord.price;
                                    oldPriceValue = lastResponseRecord.price_value;

                                    diff = Number(priceValue)-Number(oldPriceValue);
                                    if(diff!='0.00'){
                                        isChanged = true;
                                    }

                                }

                            }

                            productdata[productUrlHash] ={
                                'product_name': $(this).find('.product-name').find('a').attr('title').replace(/(\r\n|\n|\r)/gm, '').trim(),
                                'price': priceWithCurrncy,
                                'price_value': priceValue,
                                "product_url" : productUrl,
                                'old_price': oldPrice,
                                'old_price_value': oldPriceValue,
                                'is_changed':isChanged,

                                'diff': diff
                            };

                        });

                        if (!(categoryid in alldata)) {
                            alldata[categoryid] = {};
                        }
                        alldata[categoryid][id]= productdata;

                        if($('.pages').length==2 && $('.next.i-next').length==2){

                            const nextUrl = $(".next.i-next").attr('href');
                            return resolve(nextUrl);

			}
			else {
                            return resolve();

                        }
                    }
                });
            }

        var supplierTargets = await getTargetsForSupplier();

        try{
            let rawdata =  await readFileFromS3('last_mobilehq.json');
            lastResponse = JSON.parse(rawdata).data;
        }
        catch(err){

        }

        console.log(supplierTargets);

        for(let categoryid in supplierTargets){

            let idArray = supplierTargets[categoryid];

            for(let id in idArray){

                if(idArray[id]['mobilehq_url']!=undefined && idArray[id]['mobilehq_url']!=''){

                    console.log("processing "+baseURL+idArray[id]['mobilehq_url'], categoryid, id);

                    let nextUrl = await request_data(baseURL+idArray[id]['mobilehq_url'], categoryid, id);

                    while (nextUrl!=undefined){
                        console.log("processing "+baseURL+idArray[id]['mobilehq_url'], categoryid, id);
                        nextUrl = await request_data(nextUrl, categoryid, id);
                    }
                }

            }
        }

	let dataToWirte = {data:alldata,meta_data:{last_update:moment().format('Y-M-D:hh:mm:ss')}};

        console.log(dataToWirte)

    };

