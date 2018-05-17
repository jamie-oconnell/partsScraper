const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
var crypto = require('crypto');
const pathToSourceJson = 'source.json';



function getJstechData() {
    var alldata = {};
    var lastResponse = {};
    return new Promise(async resolve => {

        const baseURL = 'https://jstech.com.au/';

        const request_data = (url, categoryid, id) => {
            return new Promise(resolve => {


                //enabling cookies #HANSITHA
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
                        const allitems = $('#productsRow div.col-md-2');

                        allitems.each(function (index) {


                            let productUrl = $(this).find('#desk-img-phone').find('a').attr('href');
                            let productUrlHash = crypto.createHash('md5').update(productUrl).digest("hex");
                            var priceWithCurrncy = $(this).find('.price-new').text()
                            let priceValue = priceWithCurrncy.split("$")[1];


                            var oldPrice = priceWithCurrncy;
                            var oldPriceValue = priceValue;
                            var diff = '0.00';
                            var isChanged = false;


                            if(lastResponse[categoryid] != undefined && lastResponse[categoryid][id] != undefined){
                                //if last reposne is not empty and record exists for this categoryid


                                if(lastResponse[categoryid][id][productUrlHash]!=undefined){
                                    //this is to avod  a new record added by WEBsite.

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


                        //handling mulitple pages in a recursive way


                        if($('.load_more_btn').length==1 ){

                            return resolve(true);

                        }
                        else {
                            return resolve(false);

                        }
                    }
                });
            });
        };
        const request_data_from_JS_API = (url, categoryid, id) => {
            return new Promise(resolve => {


                //enabling cookies #HANSITHA
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

                    console.log(allitems);

                    if (allitems.length>0) {

                        for(let item of allitems){


                            let productUrl = item.href.split("?")[0];
                            let productUrlHash = crypto.createHash('md5').update(productUrl).digest("hex");

                            var priceWithCurrncy = item.price;
                            if(item.special!=undefined ||item.special!=''){
                                priceWithCurrncy = item.special
                            }

                            let priceValue = priceWithCurrncy.split("$")[1];


                            var oldPrice = priceWithCurrncy;
                            var oldPriceValue = priceValue;
                            var diff = '0.00';
                            var isChanged = false;


                            if(lastResponse[categoryid] != undefined && lastResponse[categoryid][id] != undefined){
                                //if last reposne is not empty and record exists for this categoryid


                                if(lastResponse[categoryid][id][productUrlHash]!=undefined){
                                    //this is to avod  a new record added by WEBsite.

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


                        //handling mulitple pages in a recursive way
                            return resolve(true);

                    }
                    else {
                        return resolve(false);
                    }

                });
            });
        };

        var supplierTargets = getTargetsForSupplier();

        //reading Last Json file,
        //json file for each supplier, may be it's a better solution #HANSITHA

        try{
            let rawdata = fs.readFileSync('last_jstech.json');
            lastResponse = JSON.parse(rawdata);
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

        fs.writeFile('JstechParts.json', JSON.stringify(alldata, null, 2), 'utf8', () => {
            console.log('Data Saved');

            fs.writeFile('last_jstech.json', JSON.stringify(alldata, null, 2), 'utf8', () => {
                console.log('Old Data Saved');

                console.log(alldata);
                // Pass data to the parameter as bellow
                return resolve(alldata);
            });

        });

    });

}

function getHitechPartsData() {
    var alldata = {};
    var lastResponse = {};
    return new Promise(async resolve => {

        const baseURL = 'http://hitechparts.com.au/product-category/';

        const request_data = (url, categoryid, id) => {
            return new Promise(resolve => {


                //enabling cookies #HANSITHA
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
                        const allitems = $('.products-grid .item');

                        allitems.each(function (index) {


                            let productUrl = $(this).find('.item-title').find('a').attr('href');
                            let productUrlHash = crypto.createHash('md5').update(productUrl).digest("hex");
                            var priceWithCurrncy = $(this).find('.price-box').text().replace(/(\r\n|\n|\r)/gm, '').trim();
                            let priceValue = priceWithCurrncy.split("$")[1];

                            var oldPrice = priceWithCurrncy;
                            var oldPriceValue = priceValue;
                            var diff = '0.00';
                            var isChanged = false;


                            if(lastResponse[categoryid] != undefined && lastResponse[categoryid][id] != undefined){
                                //if last reposne is not empty and record exists for this categoryid


                                if(lastResponse[categoryid][id][productUrlHash]!=undefined){
                                    //this is to avod  a new record added by WEBsite.

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
                                'product_name': $(this).find('.item-title').find('a').text().replace(/(\r\n|\n|\r)/gm, '').trim(),
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


                        //handling mulitple pages in a recursive way


                        if($('.woocommerce-pagination').length==1 && $('.next').length==1){

                            const nextUrl = $(".next").attr('href');
                            return resolve(nextUrl);

						}
						else {
                            return resolve();

                        }
                    }
                });
            });
        };

        var supplierTargets = getTargetsForSupplier();

        //reading Last Json file,
		// TODO do we need to keep a separate last,json file for each supplier, may be it's a better solution #HANSITHA

        try{
            let rawdata = fs.readFileSync('last_hitech.json');
            lastResponse = JSON.parse(rawdata);
        }
        catch(err){

        }

        console.log(supplierTargets);

        for(let categoryid in supplierTargets){

            let idArray = supplierTargets[categoryid];

            for(let id in idArray){

                if(idArray[id]['hitechparts_url']!=undefined && idArray[id]['hitechparts_url']!=''){

                    console.log("processing "+baseURL+idArray[id]['hitechparts_url'], categoryid, id);



                    let nextUrl = await request_data(baseURL+idArray[id]['hitechparts_url'], categoryid, id);

                    while (nextUrl!=undefined){
                        console.log("processing "+baseURL+idArray[id]['hitechparts_url'], categoryid, id);
                        nextUrl = await request_data(nextUrl, categoryid, id);
                    }
                }


            }
        }

        fs.writeFile('HitechParts.json', JSON.stringify(alldata, null, 2), 'utf8', () => {
            console.log('Data Saved');

            fs.writeFile('last_hitech.json', JSON.stringify(alldata, null, 2), 'utf8', () => {
                console.log('Old Data Saved');

                // Pass data to the parameter as bellow
                return resolve(alldata);
            });

        });

    });
}

function getValuePartsData() {
    var alldata = {};
    var lastResponse = {};

    return new Promise(async resolve => {

        const baseURL = 'http://www.valueparts.com.au/parts-by-model/';


        const request_data = (url, categoryid, id) => {
            return new Promise(resolve => {


		//enabling cookies #HANSITHA
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
                // children().remove().end().text().replace(/(\r\n|\n|\r)/gm, '').trim();
                            let priceValue = priceWithCurrncy.split("$")[1];
			    
			    var oldPrice = priceWithCurrncy;
			    var oldPriceValue = priceValue;
			    var diff = '0.00';
			    var isChanged = false;

			
                            if(lastResponse[categoryid] != undefined && lastResponse[categoryid][id] != undefined){
				//if last reposne is not empty and record exists for this categoryid
				

					if(lastResponse[categoryid][id][productUrlHash]!=undefined){
					//this is to avod  a new record added by WEBsite.
                               		
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

			//this is the debug function, you can comment it out if it is not required, #HANSITHA
			printLoggedInUserName(html, 'for url '+url+' ');
                        return resolve();
                    }
                });
            });
        };


        //reading Last Json file

        try{
            let rawdata = fs.readFileSync('last_valueparts.json');
            lastResponse = JSON.parse(rawdata);
        }
        catch(err){

        }

        var supplierTargets = getTargetsForSupplier();

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

        fs.writeFile('ValueParts.json', JSON.stringify(alldata, null, 2), 'utf8', () => {
            console.log('Data Saved');
            console.log(alldata)
	    
	    fs.writeFile('last_valueparts.json', JSON.stringify(alldata, null, 2), 'utf8', () => {
            console.log('Old Data Saved');

            // Pass data to the parameter as bellow
            return resolve(alldata);
       	   });

        });

    });
}

function LoginToJs(){

    return new Promise(resolve =>{
    
    const EMAIL = 'info@itshopcaloundra.com.au';
    const PASSWORD = 'GorgeousBrows01';
    const loginURL = 'https://jstech.com.au/?route=account/login&ajax=1'
    
    var options = {
    url: loginURL,
    headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
    jar: true,
    followAllRedirects: true,
    form: {
    email:EMAIL,
    password:PASSWORD
    }
    };
    
    request.post(options,function(error, response, body) {
    
    return resolve(getJstechData());
    
    });
    
    });
}

function LoginAndProceed(){

	return new Promise(resolve =>{
	

	
	const loginURL = 'http://www.valueparts.com.au/login'

	var options = {
			url: loginURL,
			headers: {'User-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0'},
			jar: true,
			followAllRedirects: true,
			form: {
			email:"info@itshopcaloundra.com.au",
			password:"H1tach!@#"
			}
	};

	request.post(options,function(error, response, body) {

		printLoggedInUserName(body,'1 ');

		return resolve(getValuePartsData());
	

		
	});

	

});
}

function printLoggedInUserName(body,customMessge){

	let $ = cheerio.load(body);
	let loginDiv = $('#welcome');
	console.log(customMessge+$(loginDiv).text()+'\n');
}

function getTargetsForSupplier(){
	var formattedRawdata= {};
	
	try{
		let rawData = fs.readFileSync(pathToSourceJson);
	        formattedRawdata = JSON.parse(rawData);
	}
	catch(err){
	    console.log(err);
	    console.log('cant read source json file');
	}

	return formattedRawdata;
}



exports.update = async (req, res) => {



   //call new functions depend on the supplier parameter #HANSITHA
    var supplier = req.params.supplier;
    var data = {};
    switch(supplier){
	case 'valueparts':
	  data =  await LoginAndProceed();
	break;
	case 'hitechparts':
	  data =  await getHitechPartsData();
	break;
	case 'jstech':
	  data =  await LoginToJs();
	break;
	case undefined:
	  data = 'No sup prrovide';
	break;
   }


    
    res.send({ data });
};
