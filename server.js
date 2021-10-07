const express = require('express')
const app = express();
const mongoose = require('mongoose')
const request = require('request')
const cors = require('cors')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Connect Mongoose
mongoose.connect("mongodb+srv://patrickodey:$('peejay')@cluster0.ewe2l.mongodb.net/ticket_app_db?retryWrites=true&w=majority")

app.get('/', (req, res) => {
    res.send("We are live")
})




const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)
})