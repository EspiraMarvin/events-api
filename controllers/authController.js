const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const generateAuthToken = require("../utils/generateAuthToken")
// const asyncHandler = require('express-async-handler')

/**
 * @desc register
 * @router POST /register
 * @access public
 */

const register = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" })

  const schema = Joi.object({
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(6).max(200).required(),
  })

  const { error } = schema.validate(req.body)
  console.log("errir at joi schema validation", error)

  if (error) return res.status(400).send(error.details[0].message)

  // check for duplicate
  const duplicate = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec()

  if (duplicate) return res.status(401).json({ message: "User Already Exists" })

  // hash pwd
  const hashedPwd = await bcrypt.hash(password, 10) // 10 is the salt rounds

  // if we've roles send username & pwd together with the roles else send username and pwd
  // const userObject =
  //   (!isArray.isArray(roles) || !roles.length)
  //     ? { email: "password", hashedPwd }
  //     : { email: "password", hashedPwd, roles: ["User"] }

  const userObject = { email, password: hashedPwd, roles: ["User"] }
  console.log("userObject", userObject)

  //create and store new user
  const user = await User.create(userObject)

  if (user) {
    // if user created
    // res.status(201).json({ messsage: `New user ${username} created` })
    const { accessToken, refreshToken } = generateAuthToken(user)
    // create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: false, // accessible only by web server when its true
      secure: false, // https when its true
      sameSite: "None", // cross-site cookie
    path: '/', // by setting path '/' it will persist across all browsers
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: set to match 7 days
    })
    res.json({ accessToken })
  } else {
    res.status(400).json({ message: "Invalid user data received" })
  }
}

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" })

  const foundUser = await User.findOne({ email }).exec()

  if (!foundUser) return res.status(401).json({ message: "Unauthorized" })

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match) return res.status(401).json({ message: "Unauthorized" })

  //  send access token containing email and roles
  const { accessToken, refreshToken } = generateAuthToken(foundUser)

  // create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: false, // accessible only by web server when its true
    secure: false, // https
    sameSite: "None", // cross-site cookie
    path: '/', // by setting path '/' it will persist across all browsers
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: set to match 7 days
  })

  res.json({ accessToken })
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" })

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" })

      const foundUser = await User.findOne({ email: decoded.email })

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" })

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      )

      res.json({ accessToken })
    })
  )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) // No content
  res.clearCookie("jwt", { httpOnly: false, sameSite: "None", secure: false, path: '/' })
  res.json({ message: "Cookie cleared" })
}

module.exports = {
  register,
  login,
  refresh,
  logout,
}
