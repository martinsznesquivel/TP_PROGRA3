botonEntrar = document.getElementById("btnEntrar");
    botonEntrar.addEventListener("click",()=>{
        const nombreUsuario = document.getElementById("nombreUsuario").value.trim();;
        if (nombreUsuario === "" || nombreUsuario.length < 2) {
            alert("Por favor ingresá tu nombre para continuar.");
            return;
        }
        // Si ingresó un nombre, lo guardás o lo redirigís
        sessionStorage.setItem("nombreUsuario", nombreUsuario);
        localStorage.setItem("carrito", JSON.stringify([]));
        console.log("Usuario ingresado:", nombreUsuario);
        window.location.href = "productos.html";
    })
