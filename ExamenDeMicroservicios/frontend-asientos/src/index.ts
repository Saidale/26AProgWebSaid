interface Asiento {
  id?: number;
  nombre_usuario: string;
  nombre_producto: string;
  cantidad: number;
  fecha_creacion?: string;
}

const API_URL = "http://localhost:3003/asientos";

const formAsiento = document.getElementById("formAsiento") as HTMLFormElement;
const inputUsuario = document.getElementById("nombreUsuario") as HTMLInputElement;
const inputProducto = document.getElementById("nombreProducto") as HTMLInputElement;
const inputCantidad = document.getElementById("cantidad") as HTMLInputElement;
const listaAsientos = document.getElementById("listaAsientos") as HTMLDivElement;
const contenedorMensaje = document.getElementById("mensaje") as HTMLParagraphElement;

async function cargarAsientos(): Promise<void> {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error("Error al obtener asientos");
    
    const asientos: Asiento[] = await respuesta.json();
    listaAsientos.innerHTML = "";

    if (asientos.length === 0) {
      listaAsientos.innerHTML = `<p style="text-align:center; color:#718096; font-weight:600;">No hay asientos reservados aún.</p>`;
      return;
    }

    asientos.forEach((asiento) => {
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("asiento-card");

      tarjeta.innerHTML = `
        <div class="asiento-info">
          <span class="asiento-id">ID Reserva: #${asiento.id}</span>
          <span class="asiento-usuario">Usuario: ${asiento.nombre_usuario}</span>
          <span class="asiento-producto">Vuelo/Producto: ${asiento.nombre_producto}</span>
          <span class="asiento-cantidad">Cantidad: ${asiento.cantidad}</span>
        </div>
        <button class="btn-eliminar" data-id="${asiento.id}">
          Eliminar
        </button>
      `;

      listaAsientos.appendChild(tarjeta);
    });
  } catch (error) {
    console.error(error);
    mostrarMensaje("No se pudieron cargar los asientos. ¿Está activa la API?", "red");
  }
}

async function crearAsiento(nombre_usuario: string, nombre_producto: string, cantidad: number): Promise<void> {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_usuario, nombre_producto, cantidad }),
    });

    if (!respuesta.ok) throw new Error("Error al guardar la reserva de asiento");

    mostrarMensaje("¡Asiento reservado con éxito!", "green");
    formAsiento.reset();
    await cargarAsientos();
  } catch (error) {
    console.error(error);
    mostrarMensaje("Ocurrió un error al intentar reservar el asiento.", "red");
  }
}

async function eliminarAsiento(id: number): Promise<void> {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) throw new Error("Error al eliminar el asiento");

    mostrarMensaje("Reserva de asiento eliminada correctamente.", "orange");
    await cargarAsientos();
  } catch (error) {
    console.error(error);
    mostrarMensaje("No se pudo eliminar el asiento seleccionado.", "red");
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

formAsiento.addEventListener("submit", async (event: Event) => {
  event.preventDefault();

  const usuario = inputUsuario.value.trim();
  const producto = inputProducto.value.trim();
  const cantidad = parseInt(inputCantidad.value, 10);

  if (!usuario || !producto || isNaN(cantidad)) {
    mostrarMensaje("Todos los campos son totalmente obligatorios.", "red");
    return;
  }

  if (cantidad <= 0) {
    mostrarMensaje("La cantidad de asientos debe ser mayor a cero.", "red");
    return;
  }

  await crearAsiento(usuario, producto, cantidad);
});

listaAsientos.addEventListener("click", async (event: MouseEvent) => {
  const elementoClickeado = event.target as HTMLElement;

  if (elementoClickeado.classList.contains("btn-eliminar")) {
    const idAsiento = Number(elementoClickeado.dataset.id);

    if (confirm("¿Estás completamente seguro de que deseas eliminar esta reserva de asiento?")) {
      await eliminarAsiento(idAsiento);
    }
  }
});

// Inicializar la carga al renderizar el script
cargarAsientos();

export {};