import React,{useMemo, useState} from 'react'
import types, { column, task } from '../types'
import TrashIcon from '../icons/TrashIcon'
import {CSS} from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import PlusIcon from '../icons/PlusIcon'
import TaskCard from './TaskCard'
import { SortableContext } from '@dnd-kit/sortable'

interface Props{
    column:column
    deleteColumn: (id: types.id) => void
    updateColumn: (id: types.id, title: string) => void
    
    createTask: (columnId: types.id) => void
    deleteTask: (id: types.id) => void
    updateTask: (id: types.id, content: string) => void
    tasks: task[]
}

function ColumnContainer(props: Props) {
    const {column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask} = props

    const [editMode, setEditMode] = useState(false)
    const tasksIds = useMemo(()=>{
        return tasks.map((task) => task.id)
    }, [tasks])

    const {setNodeRef, attributes, listeners, transition, transform, isDragging} = useSortable({
        id: column.id,
        data:{
            type: "Column",
            column,
        },
        disabled: editMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };
    
    if(isDragging){
        return (
        <div 
            ref={setNodeRef} 
            style={style}
            className='bg-mainBackgroundColor opacity-60 border-2 border-rose-500 w-[350px] h-[500px] max-h[350px] rounded-lg p-4 flex-col'
        >
            
        </div>
        )
    }

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className='bg-mainBackgroundColor w-[350px] h-[500px] max-h[500px] rounded-lg p-4 flex flex-col'
        >
            <div 
                {...attributes}
                {...listeners}
                className='bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none
                p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between'
                onClick={() => {setEditMode(true)}}
            >
                <div className='flex gap-2'>
                    <div className='flex justify-center items-center bg-columnBackgroundColor px-2 py1 
                        text-sm rounded-full'
                    >
                        0
                    </div>
                {!editMode && column.title}
                {editMode && (
                    <input 
                        className='bg-black focus:border-rose-500 rounded outline-none px-2'
                        value={column.title}
                        onChange={(e)=> updateColumn(column.id, e.target.value)}
                        onBlur={() => {setEditMode(false)}}
                        autoFocus
                        onKeyDown={(e) => {
                            if(e.key !== 'Enter')
                                return;
                            setEditMode(false)
                        }}
                    />
                )}
                </div>
                <button 
                    onClick={() => {deleteColumn(column.id)}}
                    className='stroke-gray-500 hover:stroke-white hover:bg-red-500 p-1 rounded-full' 
                >
                    <TrashIcon />
                </button>
            </div>

            {/* Tasks */}
            <div
                className='flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto'    
            >   
                <SortableContext
                    items={tasksIds}
                >
                    {tasks.map((task) => (
                        <TaskCard task={task} key={task.id} deleteTask={deleteTask} updateTask={updateTask}/>
                    ))}
                </SortableContext>
            </div>

            <button
                className='flex gap-2 items-center
                border-columnBackgroundColor border-2 rounded-md p-4 
                border-x-columnBackgroundColor hover:bg-columnBackgroundColor hover:text-rose-500
                active:bg-rose-500 active:text-white'
                onClick={() => {
                    createTask(column.id)
                }}
            >   
                <PlusIcon />
                Agregar Tarea
            </button>

        </div>
    )
}

export default ColumnContainer