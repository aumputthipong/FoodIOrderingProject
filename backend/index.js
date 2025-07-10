const express = require("express")
const path = require("path")
var cors = require('cors')
const bodyParser = require('body-parser')

const { initDatabase } = require('./config')
const app = express();

app.use(cors())
app.use(express.static(path.join(__dirname, 'static')))
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

initDatabase()
  .then(() => {
    console.log('Database ready');
    app.listen(3000, () => console.log('Listening on port 3000'));
  })
  .catch(err => console.error('Failed to init DB:', err));