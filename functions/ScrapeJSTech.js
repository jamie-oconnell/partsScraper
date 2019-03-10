function getJstechData() {
            const baseURL = 'https://jstech.com.au/';
    
            const request_data = (url, categoryid, id) => {
    
                    let getOptions = {
                        url: url,
                        headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
                        jar: true,
                        followAllRedirects: true,
                    };
    
                    request.get(getOptions, (error, responce, html) => {

                        if (!error) {
                            const $ = cheerio.load(html);
                            const allitems = $('#productsRow div.col-md-2');
    
                            allitems.each(function () {
    
                                let productUrl = $(this).find('#desk-img-phone').find('a').attr('href');
                                let productUrlHash = crypto.createHash('md5').update(productUrl).digest("hex");
                                var priceWithCurrncy = $(this).find('.price-new').text().replace(/(\r\n|\n|\r)/gm, '').trim();
                                let public_price = $(this).find('.price-old').text().replace(/(\r\n|\n|\r)/gm, '').trim();
                                if (priceWithCurrncy == ""){
                                    public_price = $(this).find('.desk-img-desc').children().last().text().replace(/(\r\n|\n|\r)/gm, '').trim();
                                    priceWithCurrncy = $(this).find('.desk-img-desc').children().last().text().replace(/(\r\n|\n|\r)/gm, '').trim();
                                }
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
                                    'product_name': $(this).find('.desk-img-desc').find('a').text().replace(/(\r\n|\n|\r)/gm, '').trim(),
                                    'price': priceWithCurrncy,
                                    'price_value': priceValue,
                                    'public_price': public_price,
                                    "product_url" : productUrl,
                                    'old_price': oldPrice,
                                    'old_price_value': oldPriceValue,
                                    'is_changed':isChanged,
                                    'diff': diff
                                };
    
                            });
    
                            if($('.load_more_btn').length==1 ){
    
                                return resolve(true);
    
                            }
                            else {
                                return resolve(false);
    
                            }
                        }
                    });
                }
            
            const request_data_from_JS_API = (url, categoryid, id) => {
                return new Promise(resolve => {
    
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
    
                        let resData = JSON.parse(responce.body);
                        const allitems = resData.products;
    
                        if (allitems.length>0) {
    
                            for(let item of allitems){
    
                                let productUrl = item.href.split("?")[0];
                                let productUrlHash = crypto.createHash('md5').update(productUrl).digest("hex");
    
                                var priceWithCurrncy = item.price;
                                if(item.special!=undefined){
                                    priceWithCurrncy = item.special;
                                }
    			    else{
    				priceWithCurrncy = item.price;
    			    }
                                let priceValue = priceWithCurrncy+''.split("$")[1];
                                let public_price = item.price;
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
                                    'product_name': item.name,
                                    'price': priceWithCurrncy,
                                    'price_value': priceValue,
                                    'public_price' : public_price,
                                    "product_url" : productUrl,
                                    'old_price': oldPrice,
                                    'old_price_value': oldPriceValue,
                                    'is_changed':isChanged,
                                    'diff': diff
                                };
    
                            }
    
                            if (!(categoryid in alldata)) {
                                alldata[categoryid] = {};
                            }
                            alldata[categoryid][id]= productdata;
    
                                return resolve(true);
    
                        }
                        else {
                            return resolve(false);
                        }
    
                    });
                });
            };
    
            var supplierTargets = await getTargetsForSupplier();
    
            try{
                let rawdata = await readFileFromS3('last_jstech.json');
                lastResponse = JSON.parse(rawdata).data;
            }
            catch(err){
    
            }
    
            console.log(supplierTargets);
    
            for(let categoryid in supplierTargets){
    
                let idArray = supplierTargets[categoryid];
    
                for(let id in idArray){
    
                    if(idArray[id]['jstech_url']!=undefined && idArray[id]['jstech_url']['url']!=undefined){
                        console.log("processing "+baseURL+idArray[id]['jstech_url']['url'], categoryid, id);
    
                        let nextUrl = await request_data(baseURL+idArray[id]['jstech_url']['url'], categoryid, id);
                        if(nextUrl){
    
                            let apiPathId = idArray[id]['jstech_url']['path'];
                            let currentPageId = 2;
                            let apiUrl = baseURL+'?route=product/category&path='+apiPathId+'&page='+currentPageId+'&sort=null&order=null&ajax=1';
    
                            let nextApicall = true;
    
                            while (nextApicall!=false && apiPathId != ''){
    
                                apiUrl = baseURL+'?route=product/category&path='+apiPathId+'&page='+currentPageId+'&sort=null&order=null&ajax=1';
                                console.log("api processing "+apiUrl, categoryid, id);
                                nextApicall = await request_data_from_JS_API(apiUrl,categoryid, id);
                                currentPageId++;
                            }
    
                        }
    
                    }
    
                }
            }
    
    
        }