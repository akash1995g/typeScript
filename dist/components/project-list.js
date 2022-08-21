var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { autobind } from "../decorator/autobind";
import { ProjectStatus } from "../models/project";
import { Component } from "./base-component";
import { ProjectItem } from "./project-item";
import { projectState } from "../state/project-state";
export class ProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.assignedProject = [];
        this.assignedProject = [];
        this.configure();
        this.renderContent();
    }
    dragOverhandeler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] == 'text/plain') {
            event.preventDefault();
            const itemLi = this.element.querySelector("ul");
            itemLi.classList.add('droppable');
        }
    }
    dropHandler(event) {
        var _a;
        const id = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
        if (id)
            projectState.moveProject(id, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }
    dragLeaveHandler(_) {
        const itemLi = this.element.querySelector("ul");
        itemLi.classList.remove('droppable');
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = '';
        for (const item of this.assignedProject) {
            new ProjectItem(this.element.querySelector('ul').id, item);
        }
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverhandeler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        projectState.addListener((projects) => {
            const filterProject = projects.filter(item => {
                if (this.type == "active") {
                    return item.projectStatus == ProjectStatus.Active;
                }
                return item.projectStatus == ProjectStatus.Finished;
            });
            this.assignedProject = filterProject;
            this.renderProjects();
        });
    }
    renderContent() {
        const itemId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = itemId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + " PROJECTS";
    }
}
__decorate([
    autobind
], ProjectList.prototype, "dragOverhandeler", null);
__decorate([
    autobind
], ProjectList.prototype, "dropHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dragLeaveHandler", null);
