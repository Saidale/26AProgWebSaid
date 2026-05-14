

export function createUL(clase: string, span1: string, span2: string): HTMLUListElement {
    const listaUL: HTMLUListElement = document.createElement('ul');
    const listaLI: HTMLLIElement = document.createElement('li');
    const elspan1: HTMLSpanElement = document.createElement('span');
    const elp: HTMLParagraphElement = document.createElement('p');
    
    listaLI.classList.add(clase, 'message'); 
    
    elspan1.textContent = span1;
    elp.textContent = span2;

    listaLI.appendChild(elspan1);
    listaLI.appendChild(elp);
    listaUL.appendChild(listaLI);
    
    return listaUL;
}

export function createForm(): HTMLFormElement {
    const formulario: HTMLFormElement = document.createElement('form');
    const input : HTMLInputElement = document.createElement('input')
    const boton : HTMLButtonElement = document.createElement('button');
    boton.disabled = true;

    input.placeholder = 'Escribe tu mensjae aqui...';
    boton.textContent = 'Enviar';
    formulario.appendChild(input);
    formulario.appendChild(boton);

    return formulario;
}

export function createTemplate(): HTMLTemplateElement {
    const template: HTMLTemplateElement = document.createElement('template');
    const listaLI: HTMLLIElement = document.createElement('li');
    const elspan1: HTMLSpanElement = document.createElement('span');
    const elp: HTMLParagraphElement = document.createElement('p');

    template.id = 'message-template'
    listaLI.classList.add('message');
    
    listaLI.appendChild(elspan1);
    listaLI.appendChild(elp);
    template.content.appendChild(listaLI);

    return template;
}

export function createSmall(): HTMLElement {
    const small: HTMLElement = document.createElement('small');
    small.innerHTML = '&nbsp;';

    return small;
}


