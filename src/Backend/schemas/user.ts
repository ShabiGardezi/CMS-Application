import mongoose from 'mongoose'
import { UserRole, UserRoleValues } from '../../shared/enums/UserRole.enum'

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.UUID,
      default: () => new mongoose.Types.UUID(),
      unique: true
    },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true }, // Store hashed password here
    role_id: {
      type: String,
      enum: UserRoleValues, // Use values from the UserRole enum
      default: UserRole.USER // Default to 'User'
    }
  },
  { timestamps: true }
)

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

export default UserModel
