const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const request = require('request')

const app = express();

app.use("combined", morgan)
// initialize cors
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//SEND SMS
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
        'url': `https://http-api.d7networks.com/send?username=zrrv5537&password=eBfqofQX&dlr-method=POST&dlr-url=https://4ba60af1.ngrok.io/receive&dlr=yes&dlr-level=3&from=AbiaIRS&content=${encodeURI(message)}&to=+234${phone}`,
        'headers': {

        }
    }

    request(options, function (error, response) {
        if (error) {
            return res.status(500).json({ success: false, msg: error })
        }
        res.status(200).json({ success: true, response: { text: "SMS sent successfully.", id: response.body } })
    })
})

app.use('/api', require('./routes/api'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`)
})