const express = require('express')
const bodyParser = require('body-parser')
require('body-parser-xml')(bodyParser)

const app = express()
app.use(bodyParser.xml())

app.get('/', (req, res) => {
  return res.send('WeChat endpoint')
})
app.use('/wechat', require('./wechat'))

const port = 3000
app.listen(port, () =>
  console.log(`WeChat endpoint listening on port ${port}...`),
)
