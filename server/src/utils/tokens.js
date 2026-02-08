import jwt from 'jsonwebtoken'

export const generateAccessToken = (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' })
   //  console.log("accessToken: ", accessToken)
    return accessToken;
}

export const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    // console.log("refreshToken: ", refreshToken)
    return refreshToken;
}