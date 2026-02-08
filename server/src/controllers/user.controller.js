import User from '../models/User.js'
import { generateAccessToken, generateRefreshToken } from '../utils/tokens.js'
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            console.log("All Fields are required")
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }


        user = new User({
            name: name,
            email: email,
            password: password,

        })

        await user.save();

        return res.status(201).json({ success: true, message: "User Registered Successfully" })

    } catch (error) {
        console.log("Error Registering User: ", error.message)
        return res.status(201).json({ success: false, message: `Error While Registering User: ${error.message}` })
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: "All Fields Are Required" })

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ success: false, message: "User Not Found" })

        // Compare user password
        const validUser = await bcrypt.compare(password, user.password)
        if (!validUser) return res.status(401).json({ success: false, message: "Invalid Credentials" })

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken
        await user.save()

        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: true, // true in production "HTTPS"
        //     sameSite: "lax",
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // })

        return res.status(200).json({ success: true, message: "User LoggedIn Successfully", accessToken, user })
    } catch (error) {
        console.log("Error While Login User: ", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}



export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken
  if (!token) return res.sendStatus(401)

  const user = await User.findOne({ refreshToken: token })
  if (!user) return res.sendStatus(403)

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403)

    const newAccessToken = generateAccessToken(user)

    res.json({ accessToken: newAccessToken })
  })
}


export const logout = async (req, res) => {
  const token = req.cookies.refreshToken

  await User.findOneAndUpdate(
    { refreshToken: token },
    { refreshToken: null }
  )

  res.clearCookie("refreshToken")
  res.sendStatus(204)
}
