import { JSDOM } from "jsdom"
const html: string = await Bun.file("index.html").text()
const dom: JSDOM = new JSDOM(html)
const document: Document = dom.window.document

//Borrar  
document.body.innerHTML= "";



const title: HTMLHeadingElement = document.createElement("h1")

//Agregando el titulo al elemento H1
title.textContent = "Laboratorio DOM con Bun y TypeScript"
document.body.appendChild(title)


//Agregando el parrafo
const paragraph: HTMLParagraphElement = document.createElement("p");
paragraph.textContent ="Esta pagina fue generada mediante la manipulacion del DOM usando TypeScript";
document.body.appendChild(paragraph);


//Agregando una lista dinamica
const list: HTMLUListElement = document.createElement("ul")

const technologies: string[] = [
"HTML",
"TypeScript",
"Bun",
"DOM"
]

for (const tech of technologies) {
        const item: HTMLLIElement = document.createElement("li")
        item.textContent = tech
        list.appendChild(item)
    }

//Agrando un boton en el body
const buttonId: HTMLButtonElement = document.createElement("button")

buttonId.textContent = "VALE CAGADAAAAAAAAAAAAAAA"
buttonId.id = "mainButton"
buttonId.classList.add("primary")
buttonId.setAttribute("onclick", "alert('xdxxd')");


document.body.appendChild(buttonId)
document.body.appendChild(list);


//----------------Tarea:  dhtmllib: Funciones  para crear  20 elementos HTML diferentes-------------------------------------
function createDiv(id:string, clase:string):HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.id = id;
    div.classList.add(clase);
    div.textContent = "Un div con id y una clase"
    return div;
}

document.body.appendChild(createDiv("container", "mainContainer"));

function createSection(id:string):HTMLElement {
    const section: HTMLElement = document.createElement("section") 
    section.id = id;
    section.textContent = "Una seccion con un id about";
    return section;
}
document.body.appendChild(createSection("about"));

function createArticle(id:string):HTMLElement {
    const article: HTMLElement = document.createElement("article");
    article.id = id;
    article.textContent = "Un articuloo con un id post1";
    return article;
}
document.body.appendChild(createArticle("post1"));

function createFooter(clase:string):HTMLElement {
    const footer:HTMLElement = document.createElement("footer");
    footer.classList.add(clase);
    footer.textContent = "Un footer con la clase pageFooter";
    return footer;
}
document.body.appendChild(createFooter("pageFooter"))

function createNav(aria_label:string):HTMLElement {
    const nav : HTMLElement = document.createElement("nav");
    nav.ariaLabel = aria_label;
    nav.textContent = "Un nav con aria-label main navigation";
    return nav;
}
document.body.appendChild(createNav("main navigation"))


/**********Guardando cambio en el archivo********************* */
await Bun.write("index.html", dom.serialize())
console.log(document.body.innerHTML==""?"Empty HTML found":"HTML found")



