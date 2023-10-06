const http = require('http')
const port = 8000

const server = http.createServer(function (req, res) {
  if (req.url === '/') {
    res.end('hello world')
  } else if (req.url === '/data') {
    res.end('callback([1,2,3,{name: "jandan", age: 18, gender: "male"}])')
  } else {
    res.end('404 Not Found')
  }
})

server.listen(port, function () {
  console.log(`server start at: http://localhost:${port}`)
})
