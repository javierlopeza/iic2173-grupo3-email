var nodemailer = require('nodemailer');
var sender = 'smtps://grupo3mailer%40gmail.com'   // emailto used for sending the email
//(Change the @ symbol to %40 or do a url encoding )
var password = 'arquisoftware'  // password of the email to use

var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: sender,
            pass: password
        }
    });


// send mail with defined transport object
exports.sendProductInfo = function(receiver){
	
	// setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'name ✔ <email@gmail.com>', 
        to: receiver,  
        subject: 'Testing test ✔', 
        text: 'It works! ✔',
        html: "<p>It works</p>",
    };


	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info.response);
	    }
	});

}