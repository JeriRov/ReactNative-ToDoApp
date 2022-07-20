import React, { useCallback, useRef } from 'react'
import { AnimatePresence, View } from 'moti'
import { ScrollView } from 'react-native-gesture-handler'
import TaskItem from '../TaskItem/TaskItem'
import { makeStyledComponent } from '../../utils/styled'
import { RefreshControl } from 'react-native'
import { TaskListProps, TaskItemProps } from './taskList.types'

const StyledView = makeStyledComponent(View)
const StyledScrollView = makeStyledComponent(ScrollView)

export const AnimatedTaskItem = (props: TaskItemProps) => {
  const {
    simultaneousHandlers,
    data,
    isEditing,
    onToggleItem,
    onToggleRefreshTask,
    onChangeSubject,
    onFinishEditing,
    onPressLabel,
    onRemove
  } = props
  const handleToggleCheckbox = useCallback(() => {
    onToggleItem(data)
  }, [data, onToggleItem])
  const handleRefreshTask = useCallback(() => {
    onToggleRefreshTask(data)
  }, [data, onToggleRefreshTask])
  const handleChangeSubject = useCallback(
    subject => {
      onChangeSubject(data, subject)
    },
    [data, onChangeSubject]
  )
  const handleFinishEditing = useCallback(() => {
    onFinishEditing(data)
  }, [data, onFinishEditing])
  const handlePressLabel = useCallback(() => {
    onPressLabel(data)
  }, [data, onPressLabel])
  const handleRemove = useCallback(() => {
    onRemove(data)
  }, [data, onRemove])

  return (
    <StyledView
      w="full"
      from={{
        opacity: 0,
        scale: 0.5,
        marginBottom: -46
      }}
      animate={{
        opacity: 1,
        scale: 1,
        marginBottom: 0
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
        marginBottom: -46
      }}
    >
      <TaskItem
        simultaneousHandlers={simultaneousHandlers}
        subject={data.subject}
        isDone={data.done}
        isRefreshing={data.refreshing}
        isEditing={isEditing}
        onToggleCheckbox={handleToggleCheckbox}
        onToggleRefreshTask={handleRefreshTask}
        onChangeSubject={handleChangeSubject}
        onFinishEditing={handleFinishEditing}
        onPressLabel={handlePressLabel}
        onRemove={handleRemove}
      />
    </StyledView>
  )
}

export default function TaskList(props: TaskListProps) {
  const {
    data,
    editingItemId,
    refreshing,
    onToggleItem,
    onToggleRefreshTask,
    onChangeSubject,
    onFinishEditing,
    onPressLabel,
    onRemoveItem,
    onRefreshing
  } = props
  const refScrollView = useRef(null)
  if (!data.length) {
    return null
  }
  return (
    <StyledScrollView
      ref={refScrollView}
      w="full"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
      }
    >
      <AnimatePresence>
        {data.map(item => (
          <AnimatedTaskItem
            key={item.id}
            data={item}
            simultaneousHandlers={refScrollView}
            isEditing={item.id === editingItemId}
            onToggleItem={onToggleItem}
            onChangeSubject={onChangeSubject}
            onFinishEditing={onFinishEditing}
            onPressLabel={onPressLabel}
            onRemove={onRemoveItem}
            onToggleRefreshTask={onToggleRefreshTask}
          />
        ))}
      </AnimatePresence>
    </StyledScrollView>
  )
}
