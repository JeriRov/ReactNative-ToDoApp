export interface TaskItem {
  id: string
  subject: string
  done: boolean
  refreshing: boolean
  userId: string
  position: number
}

export interface User {
  id: string
  username: string
  theme: string
  userId: string
}
