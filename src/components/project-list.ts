import { autobind } from "../decorator/autobind"
import { Project, ProjectStatus } from "../models/project"
import { Component } from "./base-component"
import { DragTarget } from "../models/drag-drop-interface"
import { ProjectItem } from "./project-item"
import { projectState } from "../state/project"



export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {

    assignedProject: Project[] = []

    constructor(private type: "active" | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        this.assignedProject = []
        this.configure()
        this.renderContent()
    }
    @autobind
    dragOverhandeler(event: DragEvent): void {

        if (event.dataTransfer && event.dataTransfer.types[0] == 'text/plain') {
            event.preventDefault()
            const itemLi = this.element.querySelector("ul")!
            itemLi.classList.add('droppable')
        }

    }

    @autobind
    dropHandler(event: DragEvent): void {

        const id = event.dataTransfer?.getData('text/plain')
        if (id)
            projectState.moveProject(id, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)

    }

    @autobind
    dragLeaveHandler(_: DragEvent): void {
        const itemLi = this.element.querySelector("ul")!
        itemLi.classList.remove('droppable')
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ''
        for (const item of this.assignedProject) {
            new ProjectItem(this.element.querySelector('ul')!.id, item)
        }
    }

    configure(): void {

        this.element.addEventListener('dragover', this.dragOverhandeler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)

        projectState.addListener((projects: Project[]) => {
            const filterProject = projects.filter(item => {

                if (this.type == "active") {
                    return item.projectStatus == ProjectStatus.Active
                }
                return item.projectStatus == ProjectStatus.Finished
            })
            this.assignedProject = filterProject
            this.renderProjects()
        })
    }
    renderContent() {
        const itemId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = itemId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + " PROJECTS"
    }



}
