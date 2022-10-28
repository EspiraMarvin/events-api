const express = require("express")
const router = express.Router()
const path = require("path")

// ^/$ regex - ^ refers to at the beginning of the string only
//           - $ refers to at the end of the string only
router.get("^/$|/index(.html)?", (req, res) => {
  // if user request starts with / or /index / index.html
  res.sendFile(path.join(__dirname, "..", "views", "index.html"))
})

// router.get('/*', (req, res) => {
//  res.sendFile(path.join(__dirname, '..', 'views', '404.html'))
// })

module.exports = router
