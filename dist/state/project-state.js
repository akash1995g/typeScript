import { Project, ProjectStatus } from "../models/project.js";
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFun) {
        this.listeners.push(listenerFun);
    }
}
export class ProjectState extends State {
    constructor() {
        super();
        this.project = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new ProjectState();
            return this.instance;
        }
    }
    addProject(title, description, numOfPeople) {
        const id = Math.random.toString();
        const project = new Project(id, title, description, numOfPeople, ProjectStatus.Active);
        this.project.push(project);
        this.updateListener();
    }
    moveProject(id, newStatus) {
        const pro = this.project.find(item => item.id === id);
        if (pro && pro.projectStatus != newStatus) {
            pro.projectStatus = newStatus;
            this.updateListener();
        }
    }
    updateListener() {
        for (const listener of this.listeners) {
            listener(this.project.slice());
        }
    }
}
export const projectState = ProjectState.getInstance();
