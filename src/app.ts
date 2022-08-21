/// <reference path='models/drag-drop-interface.ts' />
/// <reference path='models/project.ts' />
/// <reference path='state/project.ts' />
/// <reference path='utils/validation.ts' />
/// <reference path='decorator/autobind.ts' />



namespace App {

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


    class PrjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
        private project: Project

        get persons() {
            if (this.project.people === 1) {
                return "1 person"
            } else {
                return `${this.project.people} persons`
            }
        }

        constructor(hostId: string, project: Project) {
            super('single-project', hostId, false, project.id)
            this.project = project
            this.configure()
            this.renderContent()

        }

        @autobind
        dragStartHandler(event: DragEvent): void {

            event.dataTransfer!.setData("text/plain", this.project.id)
            event.dataTransfer!.effectAllowed = 'move'

        }

        dragEndhandler(_: DragEvent): void {
            console.log(" ended ");
        }

        renderContent(): void {
            this.element.querySelector('h2')!.textContent = this.project.title
            this.element.querySelector('h3')!.textContent = this.persons + " were assigned"
            this.element.querySelector('p')!.textContent = this.project.description
        }

        configure(): void {
            // without autobind
            // this.element.addEventListener('dragstart', this.dragStartHandler.bind(this))
            this.element.addEventListener('dragstart', this.dragStartHandler)
            this.element.addEventListener('dragend', this.dragEndhandler)

        }

    }

    class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {

        assignedProject: Project[] = []

        constructor(private type: "active" | 'finished') {
            super('project-list', 'app', false, `${type}-projects`)
            this.assignedProject = []
            this.configure()
            this.renderContent()
        }
        @autobind
        dragOverhandeler(event: DragEvent): void {

            if (event.dataTransfer && event.dataTransfer.types[0] == 'text/plain') {
                event.preventDefault()
                const itemLi = this.element.querySelector("ul")!
                itemLi.classList.add('droppable')
            }

        }

        @autobind
        dropHandler(event: DragEvent): void {

            const id = event.dataTransfer?.getData('text/plain')
            if (id)
                projectState.moveProject(id, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)

        }

        @autobind
        dragLeaveHandler(_: DragEvent): void {
            const itemLi = this.element.querySelector("ul")!
            itemLi.classList.remove('droppable')
        }

        private renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
            listEl.innerHTML = ''
            for (const item of this.assignedProject) {
                new PrjectItem(this.element.querySelector('ul')!.id, item)
            }
        }

        configure(): void {

            this.element.addEventListener('dragover', this.dragOverhandeler)
            this.element.addEventListener('dragleave', this.dragLeaveHandler)
            this.element.addEventListener('drop', this.dropHandler)

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


}



