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


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// routers
const indexRouter = require('./routes/index')
const shopRouter = require('./routes/createshop')
const detailRouter = require('./routes/shopdetail')
const userRouter = require('./routes/user')
const cartRouter = require('./routes/cart')
const queueRouter = require('./routes/queue')
const queuemanageRouter = require('./routes/queuemanager')
const { logger } = require('./middlewares')

app.use(logger)
app.use(indexRouter.router)
app.use(shopRouter.router)
app.use(detailRouter.router)
app.use(userRouter.router)
app.use(cartRouter.router)
app.use(queueRouter.router)
app.use(queuemanageRouter.router)


app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`)
})

