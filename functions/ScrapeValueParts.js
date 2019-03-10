function getValuePartsData() {
    var alldata = {};
    var lastResponse = {};

    return new Promise(async resolve => {

        const baseURL = 'http://www.valueparts.com.au/parts-by-model/';

        const request_data = (url, categoryid, id) => {
            return new Promise(resolve => {

		let getOptions = {
		url: url,
		headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
		jar: true,
		followAllRedirects: true,

		};

                request.get(getOptions, (error, responce, html) => {
                    const productdata = {};
                    if (!error) {
                        const $ = cheerio.load(html);
                        const allitems = $('div.related-box');
                        allitems.each(function (index) {

			    let productUrl = $(this).find('.name').find('a').attr('href');
			    let productUrlHash = crypto.createHash('md5').update(productUrl).digest("hex");
                var priceWithCurrncy = $(this).find('.price').find('.price-new').text();
                let priceValue = priceWithCurrncy.split("$")[1];
                var publicPrice = $(this).find('.price').find('.price-old').text();
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
                                'product_name': $(this).find('.name').find('a').text(),
                                'price': priceWithCurrncy,
                'price_value': priceValue,
                "public_price" : publicPrice,
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
                        alldata[categoryid][id] = productdata;

			printLoggedInUserName(html, 'for url '+url+' ');
                        return resolve();
                    }
                });
            });
        };

        try{
            let rawdata = readFileFromS3('last.json').then(
            lastResponse = JSON.parse(rawdata).data);
        }
        catch(err){

        }

        var supplierTargets = await getTargetsForSupplier();

        console.log(supplierTargets);

        for(let categoryid in supplierTargets){

			let idArray = supplierTargets[categoryid];

			for(let id in idArray){

			    if(idArray[id]['valueparts_url']!=undefined && idArray[id]['valueparts_url']!=''){
                    console.log(baseURL+idArray[id]['valueparts_url'], categoryid, id);
                    await request_data(baseURL+idArray[id]['valueparts_url'], categoryid, id);
                }

			}
	}

	let dataToWirte = {data:alldata,meta_data:{last_update:moment().format('Y-M-D:hh:mm:ss')}};
        fs.writeFile('ValueParts.json', JSON.stringify(dataToWirte, null, 2), 'utf8', () => {
            console.log('Data Saved');
            uploadtoS3('ValueParts.json')

	    fs.writeFile('last.json', JSON.stringify(dataToWirte, null, 2), 'utf8', () => {
            console.log('Old Data Saved');
            uploadtoS3('last.json')

            return resolve(dataToWirte);
       	   });

        });

    });
}