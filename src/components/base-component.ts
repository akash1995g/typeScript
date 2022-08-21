
export abstract class Component<T extends HTMLElement, U extends HTMLElement>{
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
