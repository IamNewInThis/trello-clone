import React,{useState} from 'react'
import TrashIcon from '../icons/TrashIcon';
import types, { task } from '../types';
import { useSortable } from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

interface Props{
    task: task;
    deleteTask: (id: types.id) => void;
    updateTask: (id: types.id, content: string) => void;

}

function TaskCard({task, deleteTask, updateTask}: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const toggleEditMode = () => {
        setEditMode((prev)=> !prev)
        setMouseIsOver(false)
    }

    const {setNodeRef, attributes, listeners, transition, transform, isDragging} = useSortable({
            id: task.id,
            data:{
                type: "Task",
                task,
            },
            disabled: editMode
    })

    const style = {
            transition,
            transform: CSS.Transform.toString(transform)
    };

    if(editMode){
        return (
            <div
                className='bg-columnBackgroundColor p-2.5 h-[100px] min-h[100px] items-center flex text-left rounded-xl
                hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task'    
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
            >
                <textarea
                    className='h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none'
                    value={task.content}
                    placeholder='Ingrese una tarea'
                    onBlur={toggleEditMode}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter'){
                            toggleEditMode()
                        }

                    }}
                    onChange={e => updateTask(task.id, e.target.value)}
                >
                    
                </textarea>
        </div>
        )
    }

    if(isDragging){
        return (
            <div 
                ref={setNodeRef} 
                style={style}
                className='bg-columnBackgroundColor p-2.5 h-[100px] min-h[100px] items-center flex text-left rounded-xl
                hover:ring-2 border-2 border-rose-500 cursor-grab relative opacity-50'
            >
                
            </div>
        )
    }

    return (
        <div
            onClick={toggleEditMode}
            className='bg-columnBackgroundColor p-2.5 h-[100px] min-h[100px] items-center flex text-left rounded-xl
            hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative'    
            onMouseEnter={() => {setMouseIsOver(true)}}
            onMouseLeave={() => {setMouseIsOver(false)}}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <p className='my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap'>
                {task.content}
            </p>

            {mouseIsOver &&(
                <button 
                    className='stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded
                    opacity-60 hover:opacity-100'
                    onClick={() => {deleteTask(task.id)}}
                >
                    <TrashIcon />
                </button>
            )}
        </div>
    )
}

export default TaskCard