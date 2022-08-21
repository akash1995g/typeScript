import { autobind } from "../decorator/autobind"
import { projectState } from "../state/project"
import { validate,Validatable } from "../utils/validation"
import { Component } from "./base-component"


// ProjectInput class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{

    titleInputField: HTMLInputElement
    descriptionInputField: HTMLInputElement
    peopleInputField: HTMLInputElement


    constructor() {
        super("project-input", 'app', true, "user-input")

        this.titleInputField = this.element.querySelector("#title") as HTMLInputElement
        this.descriptionInputField = this.element.querySelector("#description") as HTMLInputElement
        this.peopleInputField = this.element.querySelector("#people") as HTMLInputElement
        this.configure()
        this.renderContent()

    }

    private getUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputField.value
        const enteredDescription = this.descriptionInputField.value
        const enteredPeople = this.peopleInputField.value

        const titleValidateAble: Validatable = {
            value: enteredTitle,
            required: true
        }

        const descriptionValidateAble: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidateAble: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if (!validate(titleValidateAble) ||
            !validate(descriptionValidateAble) ||
            !validate(peopleValidateAble)
        ) {
            alert("invalid input")
            return
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }

    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInput = this.getUserInput()
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput
            projectState.addProject(title, description, people)
            this.clearInput()
        }
    }

    private clearInput() {
        this.titleInputField.value = ''
        this.descriptionInputField.value = ''
        this.peopleInputField.value = ''
    }

    renderContent(): void {

    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }
}
