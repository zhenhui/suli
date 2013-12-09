/**
 * Created by songsong on 12/9/13.
 */

var app = require('app')
var db = require('db')

app.get('/register', function (req, res) {

    res.render('register/index')

})

app.post('/register', function (req, res) {

    res.json(req.body)
    sendEmail(JSON.stringify(req.body,undefined,'\t'))

})


var nodemailer = require("nodemailer");

function sendEmail(str){

    var transport = nodemailer.createTransport("SMTP", {
        host: "smtp.126.com",
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        auth: {
            user: "xiong_song@126.com",
            pass: "*****"
        }
    });

    transport.sendMail({
        from : "xiong_song@126.com",
        to : "xiongsongsong@beyondsoft.com",
        subject: "主题？",
        generateTextFromHTML : true,
        html : '<h1>asdf<b style="background: red">asdf</b>asdfasdfsadf</h1>'+str
    }, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
        transport.close();
    });

}