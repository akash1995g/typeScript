/// <reference path='models/drag-drop-interface.ts' />
/// <reference path='models/project.ts' />
/// <reference path='state/project.ts' />
/// <reference path='utils/validation.ts' />
/// <reference path='decorator/autobind.ts' />
/// <reference path='components/base-component.ts' />
/// <reference path='components/project-input.ts' />
/// <reference path='components/project-item.ts' />
/// <reference path='components/project-list.ts' />



namespace App {

    const project = new ProjectInput()


    const projectActive = new ProjectList('active')
    const projectFinished = new ProjectList('finished')


}



