import React from 'react'
import types, { column } from '../types'
import TrashIcon from '../icons/TrashIcon'
import {CSS} from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

interface Props{
    column:column
    deleteColumn: (id: types.id) => void
}

function ColumnContainer(props: Props) {
    const {column, deleteColumn} = props

    const {setNodeRef, attributes, listeners, transition, transform, isDragging} = useSortable({
        id: column.id,
        data:{
            type: "Column",
            column,
        }
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
            className='bg-mainBackgroundColor w-[350px] h-[500px] max-h[350px] rounded-lg p-4 flex-col'
        >
            <div 
                {...attributes}
                {...listeners}
                className='bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none
                p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between'
            >
                <div className='flex gap-2'>
                    <div className='flex justify-center items-center bg-columnBackgroundColor px-2 py1 
                        text-sm rounded-full'
                    >
                        0
                    </div>
                {column.title}
                </div>
                <button 
                    onClick={() => {deleteColumn(column.id)}}
                    className='stroke-gray-500 hover:stroke-white hover:bg-red-500 p-1 rounded-full' 
                >
                    <TrashIcon />
                </button>
            </div>

        </div>
    )
}

export default ColumnContainer