let getProducts_form = document.getElementById("getProducts-form");
let listado_productos = document.getElementById("listado-productos");
let contenedor_formulario = document.getElementById("contenedor-formulario");

// Consultar producto por ID
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
    console.log("ERROR");
    console.log(error);
  }
});

// Mostrar producto consultado
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

                        <button id="updateProduct_button" class="update_button">Modificar Producto</button>
                    </li>
                `;

  listado_productos.innerHTML = htmlProducto;

  let updateButton = document.getElementById("updateProduct_button");
  updateButton.addEventListener("click", (event) => {
    crearFormularioPut(event, producto);
  });
}

// Crear formulario PUT
function crearFormularioPut(event, producto) {
  event.stopPropagation();
  console.table(producto);

  let formularioPutHtml = `
                <form id="updateProducts-form" class="products-form">

                    <input type="hidden" name="id" value="${producto.id}">

                    <label for="nameProd">Nombre</label>
                    <input type="text" name="nombre" id="nameProd" value="${
                      producto.nombre
                    }">

                    <label for="imageProd">Imagen</label>
                    <input type="text" name="imagen" id="imageProd" value="${
                      producto.imagen
                    }">

                    <label for="categoryprod">Categoría</label>
                    <select name="categoria" id="categoryprod" required>
                        <option value="cd" ${
                          producto.categoria === "cd" ? "selected" : ""
                        }>cd</option>
                        <option value="cassette" ${
                          producto.categoria === "cassette" ? "selected" : ""
                        }>cassette</option>
                        <option value="vinilo" ${
                          producto.categoria === "vinilo" ? "selected" : ""
                        }>vinilo</option>
                    </select>

                    <label for="priceProd">Precio</label>
                    <input type="number" name="precio" id="priceProd" value="${
                      producto.precio
                    }" required>

                    <label for="activoProd">Estado</label>
                    <select name="activo" id="activoProd">
                        <option value="1" ${producto.activo == 1 ? "selected" : ""}>Activo</option>
                        <option value="0" ${producto.activo == 0 ? "selected" : ""}>Inactivo</option>
                    </select>
                    <br>
                    <input type="submit" value="Modificar Producto">
                </form>
            `;

  contenedor_formulario.innerHTML = formularioPutHtml;

  let updateProducts_form = document.getElementById("updateProducts-form");
  updateProducts_form.addEventListener("submit", (event) =>
    actualizarProducto(event)
  );
}

// Enviar PUT al servidor
async function actualizarProducto(event) {
  event.preventDefault();

  let url = `http://localhost:3000/api/productos`;
  let formdata = new FormData(event.target);
  let data = Object.fromEntries(formdata.entries());

  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let result = await response.json();

    if (response.ok) {
      console.log(result.message);
      alert(result.message);

      // Limpiar pantalla
      listado_productos.innerHTML = "";
      contenedor_formulario.innerHTML = "";
    } else {
      console.error("Error:", result.message);
      alert(result.message);
    }
  } catch (error) {
    console.log("Error al enviar los datos:", error);
    alert("Error al procesar la solicitud");
  }
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
