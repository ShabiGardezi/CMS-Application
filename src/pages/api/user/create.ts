import connectDb from 'src/Backend/databaseConnection'
import UserModel from 'src/Backend/schemas/user'
import bcrypt from 'bcrypt'

const handler = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      const { username, email, password, role } = req.body

      // Validate input
      if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' })
      }

      // Check if the user already exists by username or email
      const existingUser = await UserModel.findOne({
        $or: [{ username }, { email }]
      })

      if (existingUser) {
        return res.status(400).json({ message: 'User with this email or username already exists' })
      }

      // Hash the password and store it as 'password_hash'
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create the new user with 'password_hash'
      const newUser = await UserModel.create({
        username,
        email,
        password_hash: hashedPassword, // Store hashed password
        role_id: role // Use 'role_id' to match the schema
      })

      // Return success response
      res.status(201).json({
        message: 'User created successfully',
        user: {
          username: newUser.username,
          email: newUser.email,
          role: newUser.role_id
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default connectDb(handler)
