
// drag and drop interface
export interface Draggable {
    dragStartHandler(event: DragEvent): void
    dragEndhandler(event: DragEvent): void
}

export interface DragTarget {
    dragOverhandeler(event: DragEvent): void
    dropHandler(event: DragEvent): void
    dragLeaveHandler(event: DragEvent): void
}
