import * as yup from 'yup'

export const userSchema = yup.object().shape({
  username: yup.string().required('User name is required'),
  password: yup.string().required('Password is required')
})
