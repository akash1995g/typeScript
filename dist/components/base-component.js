export class Component {
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
