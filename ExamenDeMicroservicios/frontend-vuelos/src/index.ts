interface Vuelo {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
  fecha_creacion?: string;
}

const API_URL = "http://localhost:3002/vuelos";

const formVuelo = document.getElementById("formVuelo") as HTMLFormElement;
const inputNombre = document.getElementById("nombre") as HTMLInputElement;
const inputPrecio = document.getElementById("precio") as HTMLInputElement;
const inputStock = document.getElementById("stock") as HTMLInputElement;
const listaVuelos = document.getElementById("listaVuelos") as HTMLDivElement;
const contenedorMensaje = document.getElementById("mensaje") as HTMLParagraphElement;

async function cargarVuelos(): Promise<void> {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error("Error al obtener vuelos");
    
    const vuelos: Vuelo[] = await respuesta.json();
    listaVuelos.innerHTML = "";

    if (vuelos.length === 0) {
      listaVuelos.innerHTML = `<p style="text-align:center; color:#94a3b8;">No hay vuelos registrados aún.</p>`;
      return;
    }

    vuelos.forEach((vuelo) => {
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("vuelo-card");

      tarjeta.innerHTML = `
        <div class="vuelo-info">
          <span class="vuelo-id">ID: #${vuelo.id}</span>
          <span class="vuelo-nombre">Destino/Nombre: ${vuelo.nombre}</span>
          <span class="vuelo-precio">Precio: $${Number(vuelo.precio).toFixed(2)}</span>
          <span class="vuelo-stock">Disponibles (Stock): ${vuelo.stock}</span>
        </div>
        <button class="btn-eliminar" data-id="${vuelo.id}">
          Eliminar
        </button>
      `;

      listaVuelos.appendChild(tarjeta);
    });
  } catch (error) {
    console.error(error);
    mostrarMensaje("No se pudieron cargar los vuelos. ¿Está activa la API?", "red");
  }
}

async function crearVuelo(nombre: string, precio: number, stock: number): Promise<void> {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, precio, stock }),
    });

    if (!respuesta.ok) throw new Error("Error al guardar el vuelo");

    mostrarMensaje("¡Vuelo registrado con éxito!", "green");
    formVuelo.reset();
    await cargarVuelos();
  } catch (error) {
    console.error(error);
    mostrarMensaje("Ocurrió un error al intentar guardar el vuelo.", "red");
  }
}

async function eliminarVuelo(id: number): Promise<void> {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) throw new Error("Error al eliminar el vuelo");

    mostrarMensaje("Vuelo eliminado correctamente.", "orange");
    await cargarVuelos();
  } catch (error) {
    console.error(error);
    mostrarMensaje("No se pudo eliminar el vuelo seleccionado.", "red");
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

formVuelo.addEventListener("submit", async (event: Event) => {
  event.preventDefault();

  const nombre = inputNombre.value.trim();
  const precio = parseFloat(inputPrecio.value);
  const stock = parseInt(inputStock.value, 10);

  if (!nombre || isNaN(precio) || isNaN(stock)) {
    mostrarMensaje("Todos los campos son totalmente obligatorios.", "red");
    return;
  }

  if (precio < 0 || stock < 0) {
    mostrarMensaje("El precio y el stock no pueden ser negativos.", "red");
    return;
  }

  await crearVuelo(nombre, precio, stock);
});

listaVuelos.addEventListener("click", async (event: MouseEvent) => {
  const elementoClickeado = event.target as HTMLElement;

  if (elementoClickeado.classList.contains("btn-eliminar")) {
    const idVuelo = Number(elementoClickeado.dataset.id);

    if (confirm("¿Estás completamente seguro de que deseas eliminar este vuelo?")) {
      await eliminarVuelo(idVuelo);
    }
  }
});

// Inicializar la carga al renderizar el script
cargarVuelos();

export {};