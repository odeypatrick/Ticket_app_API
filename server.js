// const http = require("https");

// const options = {
// 	"method": "POST",
// 	"hostname": "nexmo-nexmo-sms-verify-v1.p.rapidapi.com",
// 	"port": null,
// 	"path": "/send-verification-code?brand=AbiaIRS&phoneNumber=%2B2349033889352",
// 	"headers": {
// 		"x-rapidapi-host": "nexmo-nexmo-sms-verify-v1.p.rapidapi.com",
// 		"x-rapidapi-key": "a4c56c3f2cmshf39d03c52b4a100p11f304jsna42e940fd7b0",
// 		"useQueryString": true
// 	}
// };

// const req = http.request(options, function (res) {
// 	const chunks = [];

// 	res.on("data", function (chunk) {
// 		chunks.push(chunk);
// 	});

// 	res.on("end", function () {
// 		const body = Buffer.concat(chunks);
// 		console.log(body.toString());
// 	});
// });

// req.end();


// var axios = require("axios").default;

// var options = {
//   method: 'POST',
//   url: 'https://nexmo-nexmo-sms-verify-v1.p.rapidapi.com/send-verification-code',
//   params: {brand: 'AbiaIRS', phoneNumber: '+2349033889352'},
//   headers: {
//     'x-rapidapi-host': 'nexmo-nexmo-sms-verify-v1.p.rapidapi.com',
//     'x-rapidapi-key': 'a4c56c3f2cmshf39d03c52b4a100p11f304jsna42e940fd7b0'
//   }
// };

// axios.request(options).then(function (response) {
// 	console.log(response.data);
// }).catch(function (error) {
// 	console.error(error);
// });

const express = require('express')
const app = express();
var request = require('request')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send("We are live")
})

app.post('/message/send', (req, res) => {
    const phone = Number(req.body.phone);

    const message = `
        Thank you for purchasing N200 Tricycle Ticket
        Ticket Number: ${req.body.ticketNo} 
        Plate Number: ${req.body.plateNo}
        Valid only on: ${req.body.date} 
    `
    const options = {
        'method': 'POST',
        'url': `https://http-api.d7networks.com/send?username=zrrv5537&password=eBfqofQX&dlr-method=POST&dlr-url=https://4ba60af1.ngrok.io/receive&dlr=yes&dlr-level=3&from=smsinfo&content=${encodeURI(message)}&to=+234${phone}`,
        'headers': {

        }
    }

    request(options, function (error, response) {
        if (error) {
            return res.status(500).json({ success: false, msg: error })
        }
        res.status(200).json({ success: true, response: { text: "SMS sent successfully", id: response.body } })
    })
})

const PORT = process.env.port || 5000

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)
})
