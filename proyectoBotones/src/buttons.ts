
function applyButtonLogic(element: HTMLElement, label: string): HTMLElement {
    element.classList.add('fake-button');
    element.innerText = label;
    element.addEventListener('click', () => {
        console.log(`Botón ${element.tagName} presionado`);
    });

    return element;
}

export function createDivButton(text: string): HTMLElement {
    const elemento = document.createElement('div');
    elemento.textContent = text;
    return applyButtonLogic(elemento, text);
}

export function createSpanButton(text: string): HTMLElement {
    const elemento = document.createElement('span');
    elemento.textContent = text;
    return applyButtonLogic(elemento, text);
}

export function createImageButton(src: string, alt: string): HTMLElement {
    const elemento = document.createElement('img');
    elemento.setAttribute('src', src);
    elemento.setAttribute('alt', alt);
    elemento.classList.add('fake-button');
    elemento.textContent = alt;
    elemento.addEventListener('click', () => console.log(`Botón IMG presionado: ${alt}`));
    return elemento;
}

export function createParagraphButton(text: string): HTMLElement {
    const elemento = document.createElement('p');
    elemento.textContent = text;
    return applyButtonLogic(elemento, text);
}

export function createLinkButton(text: string): HTMLElement {
    const elemento = document.createElement('a');
    elemento.style.display = 'inline-block'; 
    elemento.textContent = text;
    return applyButtonLogic(elemento, text);
}

export function createArticleButton(text: string): HTMLElement {
    const elemento = document.createElement('article');
    elemento.textContent = text;
    return applyButtonLogic(elemento, text);
}

export function createHeaderButton(text: string): HTMLElement {
    const elemento = document.createElement('h2');
    elemento.textContent = text;
    return applyButtonLogic(elemento, text);
}

export function createListButton(text: string): HTMLElement {
    const elemento = document.createElement('li');
    elemento.style.listStyle = 'none';
    elemento.textContent = text;
    return applyButtonLogic(elemento, text);
}

export function createSectionButton(text: string): HTMLElement {
    const elemento = document.createElement('section');
    elemento.textContent = text;
    return applyButtonLogic(elemento, text);
}