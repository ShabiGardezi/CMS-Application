import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import MuiTable from './MuiTable'
import { UserColumns } from './columns/userTableColumns'

function UserTable() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateUser = (updatedUser: any) => {
    const newData = data.map(user => (user._id === updatedUser._id ? updatedUser : user))
    setData(newData)
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsLoading(true)
      await axios.delete('/api/user/delete', {
        data: { user_id: userId },
        headers: { authorization: localStorage.getItem('token') || '' }
      })
      setData(data.filter(user => user._id !== userId))
      toast.success('User deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const columns = useMemo(() => UserColumns(handleUpdateUser, handleDeleteUser), [data])

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get('/api/user/get-all', {
          headers: { authorization: localStorage.getItem('token') || '' }
        })
        setData(res.data.payload.users)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Network error. Please refresh the page.')
      } finally {
        setIsLoading(false)
      }
    }

    getData()
  }, [])

  return (
    <MuiTable
      data={data}
      columns={columns}
      options={{
        state: { isLoading }
      }}
    />
  )
}

export default UserTable
