const express = require('express')
const app = express()
const port = parseInt(process.env.PORT || '3000', 10)

app.get('/', (req, res) => {
  res.send('universal World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
