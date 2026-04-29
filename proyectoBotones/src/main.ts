import * as Buttons from "./buttons";

// Configurar el entorno global para que las funciones de buttons.ts vean 'document'
const app = document.getElementById("app");

if (app) {
    app.appendChild(Buttons.createDivButton("Div"));
    app.appendChild(Buttons.createSpanButton("Span"));
    app.appendChild(Buttons.createImageButton("https://i.pinimg.com/474x/f5/97/7e/f5977e01fcc9d55991dbd5fe357586bb.jpg", "amlococo"));
    app.appendChild(Buttons.createParagraphButton("Párrafo"));
    app.appendChild(Buttons.createLinkButton("Enlace"));
    app.appendChild(Buttons.createArticleButton("Artículo"));
    app.appendChild(Buttons.createHeaderButton("H2"));
    app.appendChild(Buttons.createListButton("LI"));
    app.appendChild(Buttons.createSectionButton("Sección"));
}


