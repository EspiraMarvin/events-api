const Event = require('../models/Event')

// const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all events
// @router GET /events
// @ccess Private
const getAllEvents = async (req, res) => {
    // lean() does not return the methods attached to Event model 
    const events = await Event.find({}).lean()    
    res.json(events)
}

module.exports = { getAllEvents }