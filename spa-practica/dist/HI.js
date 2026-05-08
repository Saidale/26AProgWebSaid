// HI.ts
function createButtonEvP(text, id, css_class, evt) {
  const button = document.createElement("button");
  button.textContent = text;
  button.id = id;
  button.classList.add(css_class);
  button.addEventListener(evt.event, evt.handler);
  return button;
}
function createInjectorButton(text, html, b) {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", () => {
    const appDiv = document.getElementById("App");
    if (appDiv) {
      appDiv.innerHTML = html;
      appDiv.appendChild(b);
    }
  });
  document.body.appendChild(button);
  return button;
}
var button3 = createButtonEvP("console", "03", "clb", {
  event: "click",
  handler: () => {
    console.log("evento ejecutado");
  }
});
var bx = createInjectorButton("Inyectar HTML", "<p><strong>¡HTML inyectado!</strong></p>", button3);
createInjectorButton("2 Inyectar HTML", "<div style='background-color: #FF0000; padding: 20px;'>Este div tiene un fondo rojo.</div>", bx);
createInjectorButton("Página Azul", "<p style='background-color: blue; padding: 20px; color: white;'>Contenido Azul</p>", button3);
createInjectorButton("Página Roja", "<div style='background-color: red; padding: 20px;'>Contenido Rojo</div>", button3);
