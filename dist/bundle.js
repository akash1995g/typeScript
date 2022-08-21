"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, projectStatus) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.projectStatus = projectStatus;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
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
            const id = Math.random.toString();
            const project = new App.Project(id, title, description, numOfPeople, App.ProjectStatus.Active);
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
    App.ProjectState = ProjectState;
    App.projectState = ProjectState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
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
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
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
    App.autobind = autobind;
})(App || (App = {}));
var App;
(function (App) {
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
    App.Component = Component;
})(App || (App = {}));
var App;
(function (App) {
    // ProjectInput class
    class ProjectInput extends App.Component {
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
            if (!App.validate(titleValidateAble) ||
                !App.validate(descriptionValidateAble) ||
                !App.validate(peopleValidateAble)) {
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
                App.projectState.addProject(title, description, people);
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
        App.autobind
    ], ProjectInput.prototype, "submitHandler", null);
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
var App;
(function (App) {
    class PrjectItem extends App.Component {
        constructor(hostId, project) {
            super('single-project', hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        get persons() {
            if (this.project.people === 1) {
                return "1 person";
            }
            else {
                return `${this.project.people} persons`;
            }
        }
        dragStartHandler(event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        }
        dragEndhandler(_) {
            console.log(" ended ");
        }
        renderContent() {
            this.element.querySelector('h2').textContent = this.project.title;
            this.element.querySelector('h3').textContent = this.persons + " were assigned";
            this.element.querySelector('p').textContent = this.project.description;
        }
        configure() {
            // without autobind
            // this.element.addEventListener('dragstart', this.dragStartHandler.bind(this))
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndhandler);
        }
    }
    __decorate([
        App.autobind
    ], PrjectItem.prototype, "dragStartHandler", null);
    App.PrjectItem = PrjectItem;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectList extends App.Component {
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
                App.projectState.moveProject(id, this.type === 'active' ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const itemLi = this.element.querySelector("ul");
            itemLi.classList.remove('droppable');
        }
        renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`);
            listEl.innerHTML = '';
            for (const item of this.assignedProject) {
                new App.PrjectItem(this.element.querySelector('ul').id, item);
            }
        }
        configure() {
            this.element.addEventListener('dragover', this.dragOverhandeler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            this.element.addEventListener('drop', this.dropHandler);
            App.projectState.addListener((projects) => {
                const filterProject = projects.filter(item => {
                    if (this.type == "active") {
                        return item.projectStatus == App.ProjectStatus.Active;
                    }
                    return item.projectStatus == App.ProjectStatus.Finished;
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
        App.autobind
    ], ProjectList.prototype, "dragOverhandeler", null);
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
/// <reference path='models/drag-drop-interface.ts' />
/// <reference path='models/project.ts' />
/// <reference path='state/project.ts' />
/// <reference path='utils/validation.ts' />
/// <reference path='decorator/autobind.ts' />
/// <reference path='components/base-component.ts' />
/// <reference path='components/project-input.ts' />
/// <reference path='components/project-item.ts' />
/// <reference path='components/project-list.ts' />
var App;
(function (App) {
    const project = new App.ProjectInput();
    const projectActive = new App.ProjectList('active');
    const projectFinished = new App.ProjectList('finished');
})(App || (App = {}));
