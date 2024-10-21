export enum UserRole {
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  CONTRIBUTOR = 'Contributor',
  USER = 'User'
}

export const UserRoleValues: UserRole[] = Object.values(UserRole)
