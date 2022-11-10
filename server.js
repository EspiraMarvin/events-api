require("dotenv").config()
require("express-async-errors")

const express = require("express")
const app = express()
const path = require("path")

// logging
const { logger, logEvents } = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")

// cookie parser
const cookieParser = require("cookie-parser")

// cors
const cors = require("cors")
const corsOptions = require("./config/corsOrigin")

// db connection
const connectDb = require("./config/dbConn")
const mongoose = require("mongoose")
const PORT = process.env.PORT || 5000
connectDb()

// save logs to file middleware
app.use(logger)

app.use(cors(corsOptions))
// middleware to use json
app.use(express.json())

// middleware passes cookies
app.use(cookieParser())

// middleware to serve static/html content
app.use("/", express.static(path.join(__dirname, "/public")))

app.use("/", require("./routes/root"))
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/events", require("./routes/eventRoutes"))


app.all("*", (req, res) => {
  // 404 not found error
  res.status(404)
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"))
  } else if (req.accepts("json")) {
    res.json({ message: '"404 Not Found' })
  } else {
    res.type("txt").send("404 Not Found")
  }
})

// error handler middleware
app.use(errorHandler)
console.log("error handler middleware passed")

mongoose.connection.once("open", () => {
  console.log("connected to mongo db")
  app.listen(PORT, () => console.log(`server running on port ${PORT}`))
})

mongoose.connection.on("error", (err) => {
  console.log(err)
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  )
})
