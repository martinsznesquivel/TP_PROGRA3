const formBienvenida = document.getElementById("form-bienvenida");

formBienvenida.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // Tomamos el valor del input y con trim eliminamos espacios al inicio y final
    const nombreUsuario = document.getElementById("nombreUsuario").value.trim();;

    // Validacion para tirar alerta si el campo está vacio
    if (nombreUsuario === "") {
        alert("Ingresa un nombre para continuar");
        return;
    }

        // Si ingresó un nombre, lo guardás o lo redirigís
        localStorage.setItem("usuario", nombreUsuario);
        
        console.log(nombreUsuario);

        // Redirigir a la página de productos
        window.location.href = "productos.html";
    })