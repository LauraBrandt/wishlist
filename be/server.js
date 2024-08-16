const express = require('express')
const cors = require('cors')
const { PORT, feURL, mongodbURI } = require('./config')

const app = express()

const corsOptions = {
  origin: feURL,
  credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

require('./src/routes')(app)

const db = require('./src/models')
db.mongoose
  .connect(mongodbURI)
  .then(() => {
    console.log('Connected to the database')
  })
  .catch(err => {
    console.log('Cannot connect to the database', err)
    process.exit()
  })

const port = process.env.PORT || PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})
