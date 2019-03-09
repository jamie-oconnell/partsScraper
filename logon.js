const request = require("request");
const cheerio = require("cheerio");

function LoginAndProceed() {
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
            email: "",
            password: ""
        }
    };

    request.post(options, function(error, response, body) {
        printLoggedInUserName(body, "1 ");

        getValuePartsData();
    });
}

function printLoggedInUserName(body, customMessge) {
    let $ = cheerio.load(body);
    let loginDiv = $("#welcome");
    console.log(customMessge + $(loginDiv).text() + "\n");
}

LoginAndProceed();
