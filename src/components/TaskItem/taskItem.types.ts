import { PanGestureHandlerProps } from 'react-native-gesture-handler'

export interface Props
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  isEditing: boolean
  isDone: boolean
  isRefreshing: boolean
  onToggleCheckbox?: () => void
  onToggleRefreshTask?: () => void
  onPressLabel?: () => void
  onRemove?: () => void
  onChangeSubject?: (subject: string) => void
  onFinishEditing?: () => void
  subject: string
}
