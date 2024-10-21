import connectDb from 'src/Backend/databaseConnection'
import UserModel from 'src/Backend/schemas/user'

const handler = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      const { username, email, password, role, user_id } = req.body

      // Update the user by ID with the correct field names
      const updatedUser = await UserModel.findByIdAndUpdate(
        user_id,
        {
          username,
          email,
          password,
          role_id: role
        },
        { new: true, runValidators: true }
      )

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json({
        message: 'User updated successfully',
        payload: { user: updatedUser }
      })
    } catch (error) {
      console.error('Error updating user:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default connectDb(handler)
