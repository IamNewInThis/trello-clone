export type id = string | number;

export type column = {
    id: id,
    title: string,
}

export type task = {
    id: id,
    content: string,
    columnId: id,
}
