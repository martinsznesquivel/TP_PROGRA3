botonEntrar = document.getElementById("btnEntrar");
    botonEntrar.addEventListener("click",()=>{
        const nombreUsuario = document.getElementById("nombreUsuario").value.trim();;
        if (nombreUsuario === "") {
            alert("Ingresa un nombre para continuar");
            return;
        }
        // Si ingresó un nombre, lo guardás o lo redirigís
        localStorage.setItem("usuario", nombreUsuario);
        console.log(nombreUsuario);
        window.location.href = "productos.html";
    })