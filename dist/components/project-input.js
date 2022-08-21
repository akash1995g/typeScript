var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { autobind } from "../decorator/autobind";
import { projectState } from "../state/project";
import { validate } from "../utils/validation";
import { Component } from "./base-component";
// ProjectInput class
export class ProjectInput extends Component {
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
