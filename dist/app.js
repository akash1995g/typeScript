"use strict";
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        const importNode = document.importNode(this.templateElement.content, true);
        this.element = importNode.firstElementChild;
        this.element.id = "user-input";
        this.titleInputField = this.element.querySelector("#title");
        this.descriptionInputField = this.element.querySelector("#description");
        this.peopleInputField = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    submitHandler(event) {
        event.preventDefault();
        console.log("data", this.titleInputField.value);
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
}
const project = new ProjectInput();
