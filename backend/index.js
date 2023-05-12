const express = require("express")
const path = require("path")
var cors = require('cors')
const bodyParser = require('body-parser')

const app = express();

app.use(cors())
// Statics
app.use(express.static(path.join(__dirname, 'static')))

// Encode body
app.use(bodyParser.urlencoded({ extended: false}));


// app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// routers
const indexRouter = require('./routes/index')
const shopRouter = require('./routes/createshop')

app.use(indexRouter.router)
app.use(shopRouter.router)

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`)
})

