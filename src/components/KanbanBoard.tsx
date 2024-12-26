import React,{useMemo, useState} from 'react'
import PlusIcon from '../icons/PlusIcon'
import types, { column } from '../types'
import ColumnContainer from './ColumnContainer'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'

function KanbanBoard() {
    const [columns, setColumns] = useState<column []>([])
    const columnsId = useMemo(()=> columns.map((col) => col.id), [columns])
    const [activeColumn, setActiveColumn] = useState<types.id | null>(null)
    
    function generateID(): types.id {
        return Math.random().toString(36).substr(2, 9);
    }

    const createNewColumn = () => {
        const columnToAdd: column = {
            id: generateID(),
            title: `Columna ${columns.length + 1}`
        }   
        // console.log(`New column ID: ${columnToAdd.id}`);
        setColumns([...columns, columnToAdd])
        
    }

    const deleteColumn = (id: types.id) => {
        const newColumns = columns.filter((column) => column.id !== id)
        setColumns(newColumns)
    }

    function onDragStart(event: DragStartEvent){
        console.log(event)
        if(event.active.data.current?.type === "Column"){
            setActiveColumn(event.active.data.current.column)
            return;
        }
    }

    function onDragEnd(event: DragEndEvent){
        const {active, over} = event

        if(!over){
            return;
        }

        const activeColumnId = active.id
        const overColumnId = over.id

        if(activeColumnId === overColumnId){
            return;
        }

        setColumns((columns) => {
            const overColumnIndex = columns.findIndex((column) => column.id === overColumnId)
            const activeColumnIndex = columns.findIndex((column) => column.id === activeColumnId)

            const newColumns = [...columns]
            newColumns.splice(overColumnIndex, 0, newColumns.splice(activeColumnIndex, 1)[0])

            return newColumns
        })
    }

    // console.log(columns)

    return (
        <div className='m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]'> 
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className='m-auto flex gap-4'>
                    <div className='flex gap-4'>
                        <SortableContext items={columnsId}>
                            {columns.map((col)=>(
                                <ColumnContainer column={col} key={col.id} deleteColumn={deleteColumn} />
                            ))}
                        </SortableContext>
                    </div>
                    <button 
                        onClick={() => {createNewColumn()}}
                        className=' h-[60px] w-[350px] min-w[350px] cursor-pointer rounded-lg
                        bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2
                        flex gap-2'
                        >
                        <PlusIcon />
                        Agregar Columna
                    </button>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer column={activeColumn} deleteColumn={deleteColumn} />
                        )}
                    </DragOverlay>
                , document.body)}
            </DndContext>
        </div>
    )
}

export default KanbanBoard