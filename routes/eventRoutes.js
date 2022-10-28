const express = require('express')
const router = express.Router()
const eventsController = require('../controllers/eventsController')
const verifyJWT = require('../middleware/verifyJwt')

// router.use(verifyJWT)

router.route('/')
.get(eventsController.getAllEvents)
// .post(eventsController.createNewEvent)
// .patch(eventsController.updateEvent)
// .delete(eventsController.deleteEvent)


module.exports = router 