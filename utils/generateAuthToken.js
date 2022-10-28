const jwt = require("jsonwebtoken")

const generateAuthToken = (user) => {
  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: user.email,
        roles: user.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  )

  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  )
  return { accessToken, refreshToken }
}

module.exports = generateAuthToken
