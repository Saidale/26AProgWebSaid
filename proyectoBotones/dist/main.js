// src/buttons.ts
function applyButtonLogic(element, label) {
  element.classList.add("fake-button");
  element.innerText = label;
  element.addEventListener("click", () => {
    console.log(`Botón ${element.tagName} presionado`);
  });
  return element;
}
function createDivButton(text) {
  const elemento = document.createElement("div");
  elemento.textContent = text;
  return applyButtonLogic(elemento, text);
}
function createSpanButton(text) {
  const elemento = document.createElement("span");
  elemento.textContent = text;
  return applyButtonLogic(elemento, text);
}
function createImageButton(src, alt) {
  const elemento = document.createElement("img");
  elemento.setAttribute("src", src);
  elemento.setAttribute("alt", alt);
  elemento.classList.add("fake-button");
  elemento.textContent = alt;
  elemento.addEventListener("click", () => console.log(`Botón IMG presionado: ${alt}`));
  return elemento;
}
function createParagraphButton(text) {
  const elemento = document.createElement("p");
  elemento.textContent = text;
  return applyButtonLogic(elemento, text);
}
function createLinkButton(text) {
  const elemento = document.createElement("a");
  elemento.style.display = "inline-block";
  elemento.textContent = text;
  return applyButtonLogic(elemento, text);
}
function createArticleButton(text) {
  const elemento = document.createElement("article");
  elemento.textContent = text;
  return applyButtonLogic(elemento, text);
}
function createHeaderButton(text) {
  const elemento = document.createElement("h2");
  elemento.textContent = text;
  return applyButtonLogic(elemento, text);
}
function createListButton(text) {
  const elemento = document.createElement("li");
  elemento.style.listStyle = "none";
  elemento.textContent = text;
  return applyButtonLogic(elemento, text);
}
function createSectionButton(text) {
  const elemento = document.createElement("section");
  elemento.textContent = text;
  return applyButtonLogic(elemento, text);
}

// src/main.ts
var app = document.getElementById("app");
if (app) {
  app.appendChild(createDivButton("Div"));
  app.appendChild(createSpanButton("Span"));
  app.appendChild(createImageButton("https://i.pinimg.com/474x/f5/97/7e/f5977e01fcc9d55991dbd5fe357586bb.jpg", "amlococo"));
  app.appendChild(createParagraphButton("Párrafo"));
  app.appendChild(createLinkButton("Enlace"));
  app.appendChild(createArticleButton("Artículo"));
  app.appendChild(createHeaderButton("H2"));
  app.appendChild(createListButton("LI"));
  app.appendChild(createSectionButton("Sección"));
}
