// Script.ts
const $ = <T extends Element>(selector: string) => document.querySelector<T>(selector);

// @ts-ignore
import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

let engine: any;

async function cargarbot(button: HTMLButtonElement) {
    const $info = $<HTMLElement>('small')!;
    const SELECTED_MODEL = "gemma-2b-it-q4f16_1-MLC"; 
    engine = await CreateMLCEngine(
        SELECTED_MODEL,
        {
            initProgressCallback: (info: any) => {
                console.log('Progreso:', info.text);
                $info.textContent = `${info.text}`
                if(info.progress === 1) {
                    button.disabled = false;
                }
            }
        }
);
}


export function InicializarPrograma() {
    const $form = $<HTMLFormElement>('form')!;
    const $input = $<HTMLInputElement>('input')!;
    const $template = $<HTMLTemplateElement>('#message-template')!;
    const $message = $<HTMLUListElement>('ul')!;
    const $button = $<HTMLButtonElement>('button')!

    let messages = []

    if(window.Worker) {
        const worker = new Worker('../worker.js')
        worker.postMessage('hola xd')
    }

    cargarbot($button)

    $form.addEventListener('submit', async (event) =>  {
        event.preventDefault();
        const messageText = $input.value.trim();

        if(messageText !== '') { 
           
            $input.value = '';

        }
    addMessage(messageText, 'user', $template, $message);
    
    const usermessage = {
        role: 'user',
        content: messageText
    }

    messages.push(usermessage)

    const chunks = await engine.chat.completions.create({
        messages,
        stream: true  
})

    let reply = ""
    const $bottext = addMessage('', 'bot' , $template, $message)

    for await (const chunk of chunks) {
        const  choice  = chunk.choices[0]
        const content = choice?.delta?.content ?? ''
        reply += content
        $bottext.textContent = reply

    }

    messages.push( {
        role: 'assistant',
        content: reply
    })

    const $container = $<HTMLElement>('#app')!
     $container.scrollTop = $container.scrollHeight;

    });
}


function addMessage(text: string, sender: string, $template: HTMLTemplateElement, $messageList: HTMLUListElement): HTMLParagraphElement {

    const clonedTemplate = $template.content.cloneNode(true) as DocumentFragment;
    const $newMessage = clonedTemplate.querySelector('.message')!; 
    const $who = $newMessage.querySelector('span')!; 
    const $text = $newMessage.querySelector('p')!; 

    $text.textContent = text;
    $who.textContent = sender === 'bot' ? 'GPT' : 'TU';
    $newMessage.classList.add(sender);

    $messageList.appendChild($newMessage);
   
    return $text;
}