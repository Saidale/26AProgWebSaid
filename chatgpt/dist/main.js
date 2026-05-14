// generarHTML.ts
function createUL(clase, span1, span2) {
  const listaUL = document.createElement("ul");
  const listaLI = document.createElement("li");
  const elspan1 = document.createElement("span");
  const elp = document.createElement("p");
  listaLI.classList.add(clase, "message");
  elspan1.textContent = span1;
  elp.textContent = span2;
  listaLI.appendChild(elspan1);
  listaLI.appendChild(elp);
  listaUL.appendChild(listaLI);
  return listaUL;
}
function createForm() {
  const formulario = document.createElement("form");
  const input = document.createElement("input");
  const boton = document.createElement("button");
  boton.disabled = true;
  input.placeholder = "Escribe tu mensjae aqui...";
  boton.textContent = "Enviar";
  formulario.appendChild(input);
  formulario.appendChild(boton);
  return formulario;
}
function createTemplate() {
  const template = document.createElement("template");
  const listaLI = document.createElement("li");
  const elspan1 = document.createElement("span");
  const elp = document.createElement("p");
  template.id = "message-template";
  listaLI.classList.add("message");
  listaLI.appendChild(elspan1);
  listaLI.appendChild(elp);
  template.content.appendChild(listaLI);
  return template;
}
function createSmall() {
  const small = document.createElement("small");
  small.innerHTML = "&nbsp;";
  return small;
}

// Script.ts
import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";
var $ = (selector) => document.querySelector(selector);
var engine;
async function cargarbot(button) {
  const $info = $("small");
  const SELECTED_MODEL = "gemma-2b-it-q4f16_1-MLC";
  engine = await CreateMLCEngine(SELECTED_MODEL, {
    initProgressCallback: (info) => {
      console.log("Progreso:", info.text);
      $info.textContent = `${info.text}`;
      if (info.progress === 1) {
        button.disabled = false;
      }
    }
  });
}
function InicializarPrograma() {
  const $form = $("form");
  const $input = $("input");
  const $template = $("#message-template");
  const $message = $("ul");
  const $button = $("button");
  let messages = [];
  if (window.Worker) {
    const worker = new Worker("../worker.js");
    worker.postMessage("hola xd");
  }
  cargarbot($button);
  $form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const messageText = $input.value.trim();
    if (messageText !== "") {
      $input.value = "";
    }
    addMessage(messageText, "user", $template, $message);
    const usermessage = {
      role: "user",
      content: messageText
    };
    messages.push(usermessage);
    const chunks = await engine.chat.completions.create({
      messages,
      stream: true
    });
    let reply = "";
    const $bottext = addMessage("", "bot", $template, $message);
    for await (const chunk of chunks) {
      const choice = chunk.choices[0];
      const content = choice?.delta?.content ?? "";
      reply += content;
      $bottext.textContent = reply;
    }
    messages.push({
      role: "assistant",
      content: reply
    });
    const $container = $("#app");
    $container.scrollTop = $container.scrollHeight;
  });
}
function addMessage(text, sender, $template, $messageList) {
  const clonedTemplate = $template.content.cloneNode(true);
  const $newMessage = clonedTemplate.querySelector(".message");
  const $who = $newMessage.querySelector("span");
  const $text = $newMessage.querySelector("p");
  $text.textContent = text;
  $who.textContent = sender === "bot" ? "GPT" : "TU";
  $newMessage.classList.add(sender);
  $messageList.appendChild($newMessage);
  return $text;
}

// main.ts
var app = document.getElementById("app");
var body = document.querySelector("body");
if (app && body) {
  app.appendChild(createUL("bot", "GPT ", "Esta es la respuesta del bot"));
  body.appendChild(createForm());
  body.appendChild(createSmall());
  body.appendChild(createTemplate());
  InicializarPrograma();
}
