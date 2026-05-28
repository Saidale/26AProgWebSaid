// src/index.ts
var API_URL = "http://localhost:3002/vuelos";
var formVuelo = document.getElementById("formVuelo");
var inputNombre = document.getElementById("nombre");
var inputPrecio = document.getElementById("precio");
var inputStock = document.getElementById("stock");
var listaVuelos = document.getElementById("listaVuelos");
var contenedorMensaje = document.getElementById("mensaje");
async function cargarVuelos() {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok)
      throw new Error("Error al obtener vuelos");
    const vuelos = await respuesta.json();
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
async function crearVuelo(nombre, precio, stock) {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre, precio, stock })
    });
    if (!respuesta.ok)
      throw new Error("Error al guardar el vuelo");
    mostrarMensaje("¡Vuelo registrado con éxito!", "green");
    formVuelo.reset();
    await cargarVuelos();
  } catch (error) {
    console.error(error);
    mostrarMensaje("Ocurrió un error al intentar guardar el vuelo.", "red");
  }
}
async function eliminarVuelo(id) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
    if (!respuesta.ok)
      throw new Error("Error al eliminar el vuelo");
    mostrarMensaje("Vuelo eliminado correctamente.", "orange");
    await cargarVuelos();
  } catch (error) {
    console.error(error);
    mostrarMensaje("No se pudo eliminar el vuelo seleccionado.", "red");
  }
}
function mostrarMensaje(texto, color) {
  contenedorMensaje.textContent = texto;
  if (color === "green")
    contenedorMensaje.style.color = "#16a34a";
  if (color === "red")
    contenedorMensaje.style.color = "#dc2626";
  if (color === "orange")
    contenedorMensaje.style.color = "#ea580c";
  setTimeout(() => {
    contenedorMensaje.textContent = "";
  }, 3000);
}
formVuelo.addEventListener("submit", async (event) => {
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
listaVuelos.addEventListener("click", async (event) => {
  const elementoClickeado = event.target;
  if (elementoClickeado.classList.contains("btn-eliminar")) {
    const idVuelo = Number(elementoClickeado.dataset.id);
    if (confirm("¿Estás completamente seguro de que deseas eliminar este vuelo?")) {
      await eliminarVuelo(idVuelo);
    }
  }
});
cargarVuelos();
