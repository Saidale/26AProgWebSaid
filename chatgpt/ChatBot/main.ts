import * as xd from "./generarHTML";
import { InicializarPrograma } from "./Script"; 

const app = document.getElementById('app');
const body = document.querySelector('body');


if(app && body) {
    
    app.appendChild(xd.createUL('bot', 'GPT ', 'Esta es la respuesta del bot'));
   

    body.appendChild(xd.createForm())
    body.appendChild(xd.createSmall());
    body.appendChild(xd.createTemplate())
    
    InicializarPrograma();
  
}

