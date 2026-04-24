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

buttonId.textContent = "Haz clic"
buttonId.id = "mainButton"
buttonId.classList.add("primary")
buttonId.setAttribute("onclick", "alert('xdxxd')");


document.body.appendChild(buttonId)
document.body.appendChild(list);



/**********Guardando cambio en el archivo********************* */
await Bun.write("index.html", dom.serialize())
console.log(document.body.innerHTML==""?"Empty HTML found":"HTML found")



