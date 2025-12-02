// Seleccionamos el elemento al que le vamos a inyectar el html
const contenedorProductos = document.getElementById("contenedor-productos");
const url = "http://localhost:3000/api/productos"; // guardamos en la variable url nuestro endpoint

async function obtenerProductos() {
  try {
    let respuesta = await fetch(url); // Hacemos una peticion al nuevo endpoint
    let data = await respuesta.json();

    let productos = data.payload; // guardamos en la variable producto el array de productos que contiene payload

    mostrarProductos(productos);
  } catch (error) {
    console.error(error);
  }
}

function mostrarProductos(array) {
  console.table(array); // Recibimos en formato tabla los productos que nos manda la funcion obtenerProductos

  let htmlProducto = "";

  array.forEach((producto) => {
    htmlProducto += `
              <div class="card-producto">
                  <img src="${producto.imagen}" alt="${producto.nombre}">
                  <h5>${producto.nombre}</h5>
                  <p>ID: ${producto.id}</p>
                  <p>$${producto.precio}</p>
            </div>
          `;
  });

  contenedorProductos.innerHTML = htmlProducto;
}

function init() {
  obtenerProductos();
}

init();
