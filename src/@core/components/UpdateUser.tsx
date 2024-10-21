import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  MenuItem,
  Select
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import toast from 'react-hot-toast'
import * as yup from 'yup'
import Icon from 'src/@core/components/icon'
import { UserRole, UserRoleValues } from '../../shared/enums/UserRole.enum'

interface State {
  password: string
  showPassword: boolean
}

interface FormInputs {
  username: string
  email: string
  password: string
  role: string
}

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  role: yup.string().required('Role is required')
})

const UpdateUser = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [state, setState] = useState<State>({ password: '', showPassword: false })

  const { userDetails } = props

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  })

  // Ensure form values are reset correctly when the userDetails prop changes
  useEffect(() => {
    if (userDetails) {
      reset({
        username: userDetails.username, // Use correct field name from database
        email: userDetails.email,
        password: '',
        role: userDetails.role_id || '' // Use role_id from the backend
      })
    }
  }, [userDetails, reset])

  const handleClickShowPassword = () => {
    setState(prevState => ({ ...prevState, showPassword: !prevState.showPassword }))
  }

  const onSubmit = async (data: FormInputs) => {
    if (loading) return
    try {
      setLoading(true)
      const res = await axios.post(
        '/api/user/update',
        {
          username: data.username, // Ensure correct field name
          email: data.email,
          password: data.password,
          role: data.role,
          user_id: userDetails._id
        },
        { headers: { authorization: localStorage.getItem('token') } }
      )
      toast.success('User updated successfully')
      props.handleUpdateUser(res.data.payload.user)
      props.setShow(false)
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title='Update User' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='username'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label='Username'
                      {...field}
                      error={Boolean(errors.username)}
                      helperText={errors.username?.message}
                      disabled={loading}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label='Email'
                      {...field}
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                      disabled={loading}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor='password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field}
                      type={state.showPassword ? 'text' : 'password'}
                      error={Boolean(errors.password)}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <Icon icon={state.showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Controller
                  name='role'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} error={Boolean(errors.role)}>
                      {UserRoleValues.map(role => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.role && <FormHelperText error>{errors.role.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth variant='contained' size='large' type='submit' disabled={loading}>
                {loading && <CircularProgress size={24} />}
                Update User
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default UpdateUser
