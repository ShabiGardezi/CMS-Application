import UpdateUserDialog from '../../dialogs/UpdateUserDialog'
import DeleteUserDialog from '../../dialogs/DeleteUserDialog'

export const UserColumns: any = (handleUpdateUser: any, handleDeleteUser: any) => [
  {
    header: 'Username',
    accessorKey: 'username'
  },
  {
    header: 'Email',
    accessorKey: 'email'
  },
  {
    header: 'Role',
    accessorKey: 'role_id'
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
    Cell: ({ cell }: any) => new Date(cell.getValue()).toLocaleString() // Format date
  },
  {
    header: 'Action',
    Cell: ({ cell }: any) => {
      const userDetails = cell.row.original

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Update user dialog */}
          <UpdateUserDialog userDetails={userDetails} handleUpdateUser={handleUpdateUser} />
          {/* Delete user dialog */}
          <DeleteUserDialog userDetails={userDetails} handleDeleteUser={handleDeleteUser} />
        </div>
      )
    }
  }
]
