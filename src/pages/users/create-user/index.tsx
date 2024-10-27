// ** React Imports
import { useState } from 'react'

// ** MUI Imports
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

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'

// ** Define Interfaces
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

// ** Default Values for Form
const defaultValues: FormInputs = {
  username: '',
  email: '',
  password: '',
  role: ''
}

// ** Validation Schema
const validationSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .matches(
      /^[a-zA-Z0-9_-]{3,20}$/,
      'Username must be 3-20 characters with no spaces, underscore or hypen is allowed'
    ),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
  role: yup.string().required('Role is required')
})

const CreateUserForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [state, setState] = useState<State>({
    password: '',
    showPassword: false
  })

  // ** Form control using react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  })

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword })
  }

  const onSubmit = async (data: FormInputs) => {
    if (loading) return
    try {
      setLoading(true)

      // Make API call to create the user
      await axios.post(
        '/api/user/create',
        {
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role
        },
        { headers: { authorization: localStorage.getItem('token') } }
      )

      toast.success('User created successfully')
      reset(defaultValues) // Reset the form fields
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title='Create New User' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={5}>
            {/* Username Field */}
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
                    />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Email Field */}
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
                    />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Password Field */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel error={Boolean(errors.password)} htmlFor='password'>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field}
                      id='password'
                      label='Password'
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
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Role Field */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel error={Boolean(errors.role)}>Role</InputLabel>
                <Controller
                  name='role'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label='Role' error={Boolean(errors.role)}>
                      <MenuItem value='Admin'>Admin</MenuItem>
                      <MenuItem value='User'>User</MenuItem>
                      <MenuItem value='Editor'>Editor</MenuItem>
                      <MenuItem value='Contributor'>Contributor</MenuItem>
                    </Select>
                  )}
                />
                {errors.role && <FormHelperText sx={{ color: 'error.main' }}>{errors.role.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button size='large' type='submit' variant='contained' disabled={loading}>
                {loading ? (
                  <CircularProgress
                    sx={{
                      color: 'common.white',
                      width: '20px !important',
                      height: '20px !important',
                      mr: theme => theme.spacing(2)
                    }}
                  />
                ) : (
                  'Create User'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateUserForm
