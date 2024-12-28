import React,{useMemo, useState} from 'react'
import PlusIcon from '../icons/PlusIcon'
import types, { column, task } from '../types'
import ColumnContainer from './ColumnContainer'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensors, useSensor, PointerSensor, DragMoveEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import TaskCard from './TaskCard'

function KanbanBoard() {
    const [columns, setColumns] = useState<column []>([])
    const [tasks, setTasks] = useState<task []>([])

    const columnsId = useMemo(()=> columns.map((col) => col.id), [columns])
    const [activeColumn, setActiveColumn] = useState<types.id | null>(null)
    const [activeTask, setActiveTask] = useState<types.id | null>(null)

    const sensors = useSensors(useSensor(PointerSensor,{
        activationConstraint:{
            distance: 3
        }
    }))
    
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

        const newTasks = tasks.filter((task) => task.columnId !== id)
        setTasks(newTasks)
    }

    const updateColumn = (id: types.id, title: string) => {
        const newColumns = columns.map((column) => {
            if(column.id === id){
                return {
                    ...column,
                    title
                }
            }
            return column
        })
        setColumns(newColumns)
    }

    function createTask(columnId: types.id){
        const newTask: task = {
            id: generateID(),
            content: `Task ${tasks.length + 1}`,
            columnId
        }
        setTasks([...tasks, newTask])
    }

    function deleteTask(id: types.id){
        const newTasks = tasks.filter((task) => task.id !== id)
        setTasks(newTasks)
    }

    function updateTask(id: types.id, content: string){
        const newTasks = tasks.map((task) => {
            if(task.id === id){
                return {
                    ...task,
                    content
                }
            }
            return task
        })
        setTasks(newTasks)
    }

    function onDragStart(event: DragStartEvent){
        // Mover Columnas
        if(event.active.data.current?.type === "Column"){
            setActiveColumn(event.active.data.current.column)
            return;
        }

        if(event.active.data.current?.type === "Task"){
            setActiveTask(event.active.data.current.task)
            return;
        }
    }

    function onDragEnd(event: DragEndEvent){
        setActiveColumn(null)
        setActiveTask(null)
        
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

    function onDragOver(event: DragMoveEvent){
        const {active, over} = event

        if(!over){
            return;
        }

        const activeId = active.id
        const overId = over.id

        if(activeId === overId)return;

        const isActiveTask = active.data.current?.type === "Task"
        const isOverTask = over.data.current?.type === "Task"

        if(!isActiveTask) return;

        if(isActiveTask && isOverTask){
            setTasks((tasks) => {
                const overIndex = tasks.findIndex((task) => task.id === overId)
                const activeIndex = tasks.findIndex((task) => task.id === activeId)

                
                tasks[activeIndex].columnId = tasks[overIndex].columnId
                

               return arrayMove(tasks, activeIndex, overIndex)
            })
        }

        const isOverActiveColumn = over.data.current?.type === "Column"

        if(isActiveTask && isOverActiveColumn){
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((task) => task.id === activeId)

                tasks[activeIndex].columnId = overId

                return arrayMove(tasks, activeIndex, activeIndex)
            })
        }

    }

    // console.log(columns)

    return (
        <div className='m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]'> 
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors} onDragOver={onDragOver}>
                <div className='m-auto flex gap-4'>
                    <div className='flex gap-4'>
                        <SortableContext items={columnsId}>
                            {columns.map((col)=>(
                                <ColumnContainer 
                                    column={col} key={col.id} deleteColumn={deleteColumn} updateColumn={updateColumn}
                                    createTask={createTask} tasks={tasks.filter((task) => task.columnId === col.id)}
                                    deleteTask={deleteTask} updateTask={updateTask}
                                />
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
                            <ColumnContainer 
                                column={activeColumn} 
                                deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask}
                                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                                deleteTask={deleteTask} updateTask={updateTask}
                            />
                        )}

                        {activeTask && (
                            <TaskCard 
                                task={activeTask} 
                                deleteTask={deleteTask} 
                                updateTask={updateTask}
                            />
                        )}
                    </DragOverlay>
                , document.body)}
            </DndContext>
        </div>
    )
}

export default KanbanBoard