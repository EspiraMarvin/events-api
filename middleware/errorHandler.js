const { logEvents } = require("./logger")

// error handler middleware , note: it overrides the default express error handling
const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  )
  console.log(err.stack)

  const status = res.statusCode ? res.statusCode : 500 // if there's no statusCode return err 500 server error

  res.status(status)

  res.json({ message: err.message, isError: true })
}

module.exports = errorHandler
