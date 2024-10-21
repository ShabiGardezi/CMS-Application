import connectDb from 'src/Backend/databaseConnection'
import UserModel from 'src/Backend/schemas/user'
import bcrypt from 'bcrypt'

const handler = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body

      // Check if the user exists by username
      const userData = await UserModel.findOne({ username })
      if (!userData) {
        return res.status(401).json({ message: 'Invalid username or password' })
      }

      // Compare the plain password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, userData.password_hash)
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' })
      }

      // Login successful, return user data
      return res.status(200).json({
        message: 'Login successful',
        payload: {
          user: {
            username: userData.username,
            email: userData.email,
            role: userData.role_id
          }
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default connectDb(handler)
