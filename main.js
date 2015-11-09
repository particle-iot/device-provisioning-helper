var request = require('request');
var fs = require('fs');

var YOUR_ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";
var YOUR_PRODUCT_ID = 0;





var that = {
	baseUrl: "https://api.particle.io",

	GENERIC_PUBLIC_KEY:  "-----BEGIN PUBLIC KEY-----\n" +
		"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBLiA/XITqywdja3J2dCPLfqcU\n" +
		"jdacNaGBys6Xz1TJCyq4NSUtr8RU7AkWP3e/ePKp5Lg/vJnEBo1Z8gPR1QMWAWup\n" +
		"Gqz+S9DxIBwCIeVXovZE6ZFRZ6m0dsCBnZ36UuME2vBS70cL6yzfu71fRDeGg4Lh\n" +
		"yr+GNspjRSDkqgeBUQIDAQAB\n" +
		"-----END PUBLIC KEY-----",

	sendPublicKey: function (deviceID, keyFilename) {
		if (!deviceID || deviceID == "") {
			console.error("device id was invalid");
			return;
		}

		var keyStr;
		if (!keyFilename || (keyFilename == "") || !fs.existsSync(keyFilename)) {
			console.log("using generic public key");
			keyStr = that.GENERIC_PUBLIC_KEY;
		}
		else {
			keyStr = fs.readFileSync(keyFilename).toString();
		}
		
		console.log('attempting to add a new public key for device ' + deviceID);

		request({
			uri: that.baseUrl + "/v1/provisioning/" + deviceID,
			method: "POST",
			form: {
				deviceID: deviceID,
				publicKey: keyStr.toString(),
				order: "script_" + ((new Date()).getTime()),
				filename: "script",
				access_token: YOUR_ACCESS_TOKEN,
				product_id: YOUR_PRODUCT_ID
			},
			json: true
		}, 
		function (error, response, body) 
		{
			if (error || body.error) {
				console.log("Provisioning Error: ", error || body.error);
			}
			else {
				console.log("Success - Device Provisioned!");
			}
		});
	}
};


var args = process.argv;

if (YOUR_ACCESS_TOKEN == "YOUR_ACCESS_TOKEN") {
	console.error("Please edit main.js, and change YOUR_ACCESS_TOKEN to your access token" );
	return;
}
if (YOUR_PRODUCT_ID == 0) {
	console.error("Please edit main.js, and change PRODUCT_ID to your product id");
	return;
}

if (args.length < 3) {
	var helpLines = [
		"Please include deviceID, and an optional keyfile",
		"",
		"Example: ",
		" node main.js SOME_DEVICE_ID ",
		" node main.js SOME_DEVICE_ID SOME_KEY_FILE"
	];
	console.log(helpLines.join("\n"));
}
else {
	var deviceID = args[2];
	var keyFile  = (args.length >= 4) ? args[3] : null;

	that.sendPublicKey(deviceID, keyFile);	
}
