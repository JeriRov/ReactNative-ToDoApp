import { IButtonProps } from "native-base"

export interface Props extends IButtonProps {
  active: boolean
  icon: string
  children: React.ReactNode
}