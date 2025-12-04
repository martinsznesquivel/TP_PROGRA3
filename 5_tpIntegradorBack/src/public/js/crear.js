const altaProductsForm = document.getElementById("altaProducts-form");
const url = "http://localhost:3000/api/productos";

altaProductsForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evitamos que el formulario se envie por defecto

  // Guardamos en una variable formData los datos del formulario
  let formData = new FormData(event.target);

  // creamos un objeto JS con los datos del objeto FormData
  let data = Object.fromEntries(formData.entries());

  enviarProducto(data);

  async function enviarProducto(data) {
    console.table(data);

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let result = await response.json();

      if (response.ok) {
        console.log(result.message);
        alert(`Producto creado con exito con id: ${result.productId}`);
        event.target.reset();
      } else {
        alert(`Error en la creacion de producto: ${result.message}`);
      }
    } catch (error) {
      console.error("Error al enviar los datos: ", error);
      alert("Error al procesar la solicitud");
    }
  }
});
