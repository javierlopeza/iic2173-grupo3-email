var request = require('request')

// ask for a specific product to Server. Request format:
/* ------------
GET /product/:id
---------------
HEADERS:
"Authorization" : "JWT dad7asciha7..."
--------------- */
exports.askForAProduct = function(product, id) {
	request({
		  uri: "https://www.arqss8.ing.puc.cl/${product}/${id}",
		  method: "GET",
		  timeout: 10000,
		  followRedirect: true,
		  maxRedirects: 10
		}, function(error, response, body) {
		  	console.log('error:', error); // Print the error if one occurred
  			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  			console.log('body:', body); // Print the HTML
		});
}

// ask for the whole product catalog. Request format:
/* ------------
GET /products
---------------
HEADERS:
"Authorization" : "JWT dad7asciha7..."
--------------- */
exports.askForProducts = function() {
	request({
		  uri: "https://www.arqss8.ing.puc.cl/products",
		  method: "GET",
		  timeout: 10000,
		  followRedirect: true,
		  maxRedirects: 10
		}, function(error, response, body) {
			console.log('error:', error); // Print the error if one occurred
  			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  			console.log('body:', body); // Print the HTML
		});
}

// ask for the product's categories
/* ------------
GET /categories
---------------
HEADERS:
"Authorization" : "JWT dad7asciha7..."
--------------- */
exports.askForCategories = function() {
	request({
		  uri: "https://www.arqss8.ing.puc.cl/categories",
		  method: "GET",
		  timeout: 10000,
		  followRedirect: true,
		  maxRedirects: 10
		}, function(error, response, body) {
		  	console.log('error:', error); // Print the error if one occurred
  			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  			console.log('body:', body); // Print the HTML
		});
}