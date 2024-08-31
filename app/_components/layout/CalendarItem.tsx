'use client'
import React, { useCallback, useEffect, useState } from 'react'
import takeMonth from '@/_utils/calendar/getCalendarDate'
import { format } from 'date-fns'
import { Task } from '@/_types/taskType'
import { useTaskStore } from '@/store/useTaskStore'
import { useViewTaskModalState, useModalActions, useEditTaskModalState } from '@/store/useModalState'
import Modal from '@/common/modal/Modal'
import TaskForm from '@/common/modal/TaskForm'
import Image from 'next/image'
import RemoveIcon from '@/public/icons/trashcan.png'
import EditIcon from '@/public/icons/editicon.png'
interface CalendarItemProps {
  currentDate: Date
  onDateSelect: (date: Date) => void
}
const CalendarItem: React.FC<CalendarItemProps> = ({ currentDate, onDateSelect }) => {
  const viewTask = useViewTaskModalState()
  const editTask = useEditTaskModalState()
  const deleteTask = useTaskStore(state => state.deleteTask)
  const { changeModalState } = useModalActions()
  const fetchTaskSelected = useTaskStore(state => state.fetchTaskSelected)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const dateData = takeMonth(currentDate)()
  const [selectedDate, setSelectedDate] = useState(currentDate)

  const selectDateItem = useCallback(
    (date: Date) => {
      setSelectedDate(date)
      onDateSelect(date)
      fetchTaskSelected(date)
      if (!viewTask) {
        changeModalState('view', true)
      }
    },
    [viewTask, changeModalState],
  )

  useEffect(() => {
    fetchTaskSelected(selectedDate)
  }, [selectedDate, fetchTaskSelected])

  useEffect(() => {
    if (viewTask || editTask) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [viewTask, editTask])

  const deleteTaskBtn = useCallback(
    async (id: number) => {
      await deleteTask(id)
      setSelectedTask(null)
      changeModalState('view', false)
    },
    [deleteTask, changeModalState],
  )

  const editTaskBtn = useCallback(() => {
    changeModalState('edit', true)
  }, [changeModalState])

  return (
    <div className="">
      {dateData.map((week, index) => (
        <div key={index} className="flex justify-around gap-[6px] mb-[4px] w-full ">
          {week.map(day => (
            <div onClick={() => selectDateItem(day)} key={format(day, 'yyyy-MM-dd')} className="w-full">
              <div className="min-w-[60px] sm:w-[80px] md:w-full w-full min-h-[90px] px-[4px] py-[2px] rounded-sm bg-neutral-50 text-neutral-700">
                <button>{format(day, 'd')}</button>
              </div>
            </div>
          ))}
        </div>
      ))}
      <Modal>
        {viewTask && selectedTask ? (
          <div className="max-sm:w-full min-w-full bg-transparent resize-none h-80">
            {editTask ? (
              <TaskForm
                initialTitle={selectedTask.todo_title}
                initialDetail={selectedTask.todo_detail}
                taskId={selectedTask.todo_id}
                dueDate={selectedTask.due_date}
              />
            ) : (
              <div className="w-full h-full">
                <div className="border-b-4">
                  <div className="w-full h-full py-[8px] break-all">{selectedTask.todo_title}</div>
                </div>
                <div className="border-b-4 h-full">
                  <div className="w-full h-full pt-[8px] py-[8px] break-all">{selectedTask.todo_detail}</div>
                </div>
                <div className="absolute bottom-0 h-[60px] w-full flex justify-between items-center">
                  <button
                    onClick={() => deleteTaskBtn(selectedTask.todo_id)}
                    className="relative h-full bg-gray-200 hover:bg-gray-300 active:bg-gray-300 rounded-md w-1/2 mr-[5px]"
                  >
                    <Image
                      src={RemoveIcon}
                      alt="delete button"
                      style={{ width: 22, height: 27.5 }}
                      className="insetcenter"
                    />
                  </button>
                  <button
                    onClick={editTaskBtn}
                    className="relative h-full  bg-gray-200 hover:bg-gray-300 active:bg-gray-300 rounded-md w-1/2 "
                  >
                    <Image src={EditIcon} alt="edit button" style={{ width: 30, height: 30 }} className="insetcenter" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <TaskForm dueDate={selectedDate} />
        )}
      </Modal>
    </div>
  )
}

export default CalendarItem