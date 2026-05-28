interface Pasajero {
  id?: number;
  nombre: string;
  correo: string;
}

const API_URL = "http://localhost:3001/pasajeros";

const formPasajero = document.getElementById("formPasajero") as HTMLFormElement;
const inputNombre = document.getElementById("nombre") as HTMLInputElement;
const inputCorreo = document.getElementById("correo") as HTMLInputElement;
const listaPasajeros = document.getElementById("listaPasajeros") as HTMLDivElement;
const contenedorMensaje = document.getElementById("mensaje") as HTMLParagraphElement;

async function cargarPasajeros(): Promise<void> {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error("Error");
    
    const pasajeros: Pasajero[] = await respuesta.json();
    listaPasajeros.innerHTML = "";

    if (pasajeros.length === 0) {
      listaPasajeros.innerHTML = `<p style="text-align:center; color:#94a3b8;">No hay pasajeros registrados aún.</p>`;
      return;
    }

    pasajeros.forEach((pasajero) => {
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("pasajero-card");

      tarjeta.innerHTML = `
        <div class="pasajero-info">
          <span class="pasajero-id">ID: #${pasajero.id}</span>
          <span class="pasajero-nombre">${pasajero.nombre}</span>
          <span class="pasajero-correo">${pasajero.correo}</span>
        </div>
        <button class="btn-eliminar" data-id="${pasajero.id}">
          Eliminar
        </button>
      `;

      listaPasajeros.appendChild(tarjeta);
    });
  } catch (error) {
    console.error(error);
    mostrarMensaje("No se pudieron cargar los pasajeros. ¿Está activa la API?", "red");
  }
}

async function crearPasajero(nombre: string, correo: string): Promise<void> {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, correo }),
    });

    if (!respuesta.ok) throw new Error("Error");

    mostrarMensaje("¡Pasajero registrado con éxito!", "green");
    formPasajero.reset();
    await cargarPasajeros();
  } catch (error) {
    console.error(error);
    mostrarMensaje("Ocurrió un error al intentar guardar el pasajero.", "red");
  }
}

async function eliminarPasajero(id: number): Promise<void> {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) throw new Error("Error");

    mostrarMensaje("Pasajero eliminado correctamente.", "orange");
    await cargarPasajeros();
  } catch (error) {
    console.error(error);
    mostrarMensaje("No se pudo eliminar al pasajero seleccionado.", "red");
  }
}

function mostrarMensaje(texto: string, color: "green" | "red" | "orange"): void {
  contenedorMensaje.textContent = texto;
  
  if (color === "green") contenedorMensaje.style.color = "#16a34a";
  if (color === "red") contenedorMensaje.style.color = "#dc2626";
  if (color === "orange") contenedorMensaje.style.color = "#ea580c";

  setTimeout(() => {
    contenedorMensaje.textContent = "";
  }, 3000);
}

formPasajero.addEventListener("submit", async (event: Event) => {
  event.preventDefault();

  const nombre = inputNombre.value.trim();
  const correo = inputCorreo.value.trim();

  if (!nombre || !correo) {
    mostrarMensaje("Todos los campos son totalmente obligatorios.", "red");
    return;
  }

  await crearPasajero(nombre, correo);
});

listaPasajeros.addEventListener("click", async (event: MouseEvent) => {
  const elementoClickeado = event.target as HTMLElement;

  if (elementoClickeado.classList.contains("btn-eliminar")) {
    const idPasajero = Number(elementoClickeado.dataset.id);

    if (confirm("¿Estás completamente seguro de que deseas eliminar a este pasajero?")) {
      await eliminarPasajero(idPasajero);
    }
  }
});

cargarPasajeros();

export {};