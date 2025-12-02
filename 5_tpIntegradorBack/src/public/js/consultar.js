let getProducts_form = document.getElementById("getProducts-form");
let listado_productos = document.getElementById("listado-productos");

getProducts_form.addEventListener("submit", async (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);
  let data = Object.fromEntries(formData.entries());
  let idProducto = data.id;

  try {
    let respuesta = await fetch(
      `http://localhost:3000/api/productos/${idProducto}`
    );

    let result = await respuesta.json();

    if (respuesta.ok) {
      let producto = result.payload[0];

      mostrarProducto(producto);
    } else {
      console.error(result.message);

      mostrarError(result.message);
    }
  } catch (error) {
    console.log("ERROR: ", error);
    mostrarError("Ocurrió un error al consultar el producto.");
  }
});

function mostrarProducto(producto) {
  let imagen = producto.imagen;

  console.table(producto);

  let htmlProducto = `
                    <li class="producto-card">
                        <img src="${imagen}" alt="Imagen de ${producto.nombre}" class="product-img">
                    
                        <div class="detalles-producto">
                            <h4>${producto.nombre}</h4>
                            <p>ID: ${producto.id}</p>
                            <p><strong>Precio:</strong> $${producto.precio}</p>
                            <p><strong>Categoria:</strong> ${producto.categoria}</p>
                        </div>
                    </li>
                `;

  listado_productos.innerHTML = htmlProducto;
}

function mostrarError(message) {
  listado_productos.innerHTML = `
              <li class="message-error">
                <p>
                  <strong>Error:</strong>
                  <span>${message}</span>
                </p>
              </li>
            `;
}
