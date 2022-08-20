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


    private submitHandler(event: Event) {
        event.preventDefault()
        console.log("data", this.titleInputField.value)
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }
}

const project = new ProjectInput()