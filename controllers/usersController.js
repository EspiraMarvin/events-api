const User = require('../models/User')
const bcrypt = require('bcrypt')

// @desc Get al users
// @router GET /users
// @ccess Private
const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password').lean()    // lean() does not return the methods attached to User model // select('-password') means dont return users with passwords 
    if (!users?.length) return res.status(400).json({ message: "No Users Found" })
    res.json(users)
}


// @desc Update a user
// @router PATCH /users
// @ccess Private
const updateUser = async (req, res) => {
    const { id, email, roles, active, password } = req.body
    
    // confirm data
    if (!id || !email || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields except password are required' })          // 400 bad req
    }

     // Does the user exist to update?
    const user = await User.findById(id).exec()
    
    if (!user) return res.status(400).json({ message: 'User not found' })

    // check for duplicate
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2}).lean().exec()
    
    // Allow updates to the original user -- update the user with the id passed to req body only and not any other duplicate username incase exists
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.email = email
    user.roles = roles

    if (password) {
        // hash password
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })

}

// @desc Delete a user
// @router DELETE /users
// @ccess Private
const deleteUser = async (req, res) => {
    const { id } = req.body
    
    if (!id) return res.status(400).json({ message: 'User ID Required '})

    const user = await User.findById(id).exec()

    if (!user) return res.status(400).json({ message: 'User not found' })

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = { getAllUsers, updateUser, deleteUser }