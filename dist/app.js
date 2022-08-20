"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, projectStatus) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.projectStatus = projectStatus;
    }
}
// decorator
function autobind(target, methodName, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
function validate(validatableInput) {
    let valid = true;
    if (validatableInput.required) {
        valid = valid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null &&
        typeof validatableInput.value === 'string') {
        valid = valid && validatableInput.value.length > validatableInput.minLength;
    }
    if (validatableInput.maxLength != null &&
        typeof validatableInput.value === 'string') {
        valid = valid && validatableInput.value.length < validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        valid = valid && validatableInput.value > validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        valid = valid && validatableInput.value < validatableInput.max;
    }
    return valid;
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFun) {
        this.listeners.push(listenerFun);
    }
}
class ProjectState extends State {
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
        const project = new Project(Math.random.toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.project.push(project);
        console.log("", project);
        for (const listener of this.listeners) {
            listener(this.project.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
class Component {
    constructor(templateId, hostId, insertAtBegin, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostId);
        const importNode = document.importNode(this.templateElement.content, true);
        this.element = importNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtBegin);
    }
    attach(insertAtbegining) {
        this.hostElement.insertAdjacentElement(insertAtbegining ? 'afterbegin' : 'beforeend', this.element);
    }
}
// ProjectInput class
class ProjectInput extends Component {
    constructor() {
        super("project-input", 'app', true, "user-input");
        this.titleInputField = this.element.querySelector("#title");
        this.descriptionInputField = this.element.querySelector("#description");
        this.peopleInputField = this.element.querySelector("#people");
        this.configure();
        this.renderContent();
    }
    getUserInput() {
        const enteredTitle = this.titleInputField.value;
        const enteredDescription = this.descriptionInputField.value;
        const enteredPeople = this.peopleInputField.value;
        const titleValidateAble = {
            value: enteredTitle,
            required: true
        };
        const descriptionValidateAble = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const peopleValidateAble = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };
        if (!validate(titleValidateAble) ||
            !validate(descriptionValidateAble) ||
            !validate(peopleValidateAble)) {
            alert("invalid input");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.getUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
            this.clearInput();
        }
    }
    clearInput() {
        this.titleInputField.value = '';
        this.descriptionInputField.value = '';
        this.peopleInputField.value = '';
    }
    renderContent() {
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const project = new ProjectInput();
class ProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.assignedProject = [];
        this.assignedProject = [];
        this.configure();
        this.renderContent();
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = '';
        for (const item of this.assignedProject) {
            const itemDetails = document.createElement('li');
            itemDetails.textContent = item.title;
            listEl === null || listEl === void 0 ? void 0 : listEl.appendChild(itemDetails);
        }
    }
    configure() {
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
const projectActive = new ProjectList('active');
const projectFinished = new ProjectList('finished');
