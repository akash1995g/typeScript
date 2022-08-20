enum ProjectStatus { Active, Finished }

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public projectStatus: ProjectStatus
    ) { }
}



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

type Listener = (items: Project[]) => void

class ProjectState {
    private listeners: Listener[] = []
    private project: Project[] = []
    private static instance: ProjectState

    constructor() {

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


        const project = new Project(Math.random.toString(),
            title, description, numOfPeople, ProjectStatus.Active)

        this.project.push(project)
        console.log("", project)
        for (const listener of this.listeners) {
            listener(this.project.slice())
        }
    }

    addListener(listenerFun: Listener) {
        this.listeners.push(listenerFun)
    }
}

const projectState = ProjectState.getInstance()


abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    templateElement: HTMLTemplateElement
    hostElement: T
    element: U
    constructor(templateId: string,
        hostId: string,
        insertAtBegin: boolean,
        newElementId?: string) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement
        this.hostElement = document.getElementById(hostId)! as T

        const importNode = document.importNode(this.templateElement.content, true)
        this.element = importNode.firstElementChild as U
        if (newElementId) {
            this.element.id = newElementId
        }
        this.attach(insertAtBegin)
    }

    private attach(insertAtbegining: boolean) {
        this.hostElement.insertAdjacentElement(insertAtbegining ? 'afterbegin' : 'beforeend', this.element)
    }

    abstract configure(): void
    abstract renderContent(): void

}

// ProjectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{

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

const project = new ProjectInput()


class ProjectList extends Component<HTMLDivElement, HTMLElement>{

    assignedProject: Project[] = []

    constructor(private type: "active" | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        this.assignedProject = []
        this.configure()
        this.renderContent()
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ''
        for (const item of this.assignedProject) {
            const itemDetails = document.createElement('li')
            itemDetails.textContent = item.title
            listEl?.appendChild(itemDetails)
        }
    }

    configure(): void {
        projectState.addListener((projects: Project[]) => {
            const filterProject = projects.filter(item => {

                if (this.type == "active") {
                    return item.projectStatus == ProjectStatus.Active
                }
                return item.projectStatus == ProjectStatus.Finished
            })
            this.assignedProject = filterProject
            this.renderProjects()
        })
    }
    renderContent() {
        const itemId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = itemId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + " PROJECTS"
    }

}

const projectActive = new ProjectList('active')
const projectFinished = new ProjectList('finished')



