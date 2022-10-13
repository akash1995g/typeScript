import { Project, ProjectStatus } from "../models/project.js"


type Listener<T> = (items: T[]) => void

class State<T>{
    protected listeners: Listener<T>[] = []

    addListener(listenerFun: Listener<T>) {
        this.listeners.push(listenerFun)
    }
}

export class ProjectState extends State<Project> {
    private project: Project[] = []
    private static instance: ProjectState

    constructor() {
        super()
    }

    static getInstance() {
        if (this.instance) {
            return this.instance
        } else {
            this.instance = new ProjectState()
            return this.instance
        }
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const id = Math.random.toString()
        const project = new Project(id,
            title, description, numOfPeople, ProjectStatus.Active)

        this.project.push(project)
        this.updateListener()

    }

    moveProject(id: string, newStatus: ProjectStatus) {
        const pro = this.project.find(item => item.id === id)
        if (pro && pro.projectStatus != newStatus) {
            pro.projectStatus = newStatus
            this.updateListener()
        }

    }

    updateListener() {
        for (const listener of this.listeners) {
            listener(this.project.slice())
        }
    }


}

export const projectState = ProjectState.getInstance()
