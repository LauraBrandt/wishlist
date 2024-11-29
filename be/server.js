const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

if (dotenv) {
  dotenv.config()
}

const app = express()

const corsOptions = {
  origin: process.env.FE_URL_LOCAL,
  credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

require('./src/routes')(app)

const db = require('./src/models')
db.mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to the database')
  })
  .catch(err => {
    console.log('Cannot connect to the database', err)
    process.exit()
  })

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})
