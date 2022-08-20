// decorator
function autobind(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn
        },
    }
    return adjDescriptor
}

interface Validatable {
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

function validate(validatableInput: Validatable) {
    let valid = true
    if (validatableInput.required) {
        valid = valid && validatableInput.value.toString().trim().length !== 0
    }

    if (validatableInput.minLength != null &&
        typeof validatableInput.value === 'string') {
        valid = valid && validatableInput.value.length > validatableInput.minLength
    }

    if (validatableInput.maxLength != null &&
        typeof validatableInput.value === 'string') {
        valid = valid && validatableInput.value.length < validatableInput.maxLength
    }

    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        valid = valid && validatableInput.value > validatableInput.min
    }

    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        valid = valid && validatableInput.value < validatableInput.max
    }

    return valid
}

// ProjectInput class
class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement

    titleInputField: HTMLInputElement
    descriptionInputField: HTMLInputElement
    peopleInputField: HTMLInputElement


    constructor() {
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement
        this.hostElement = document.getElementById("app")! as HTMLDivElement

        const importNode = document.importNode(this.templateElement.content, true)
        this.element = importNode.firstElementChild as HTMLFormElement
        this.element.id = "user-input"

        this.titleInputField = this.element.querySelector("#title") as HTMLInputElement
        this.descriptionInputField = this.element.querySelector("#description") as HTMLInputElement
        this.peopleInputField = this.element.querySelector("#people") as HTMLInputElement
        this.configure()
        this.attach()

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
            this.clearInput()
        }
    }

    private clearInput() {
        this.titleInputField.value = ''
        this.descriptionInputField.value = ''
        this.peopleInputField.value = ''
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }
}

const project = new ProjectInput()