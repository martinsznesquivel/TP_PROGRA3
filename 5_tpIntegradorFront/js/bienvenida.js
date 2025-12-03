botonEntrar = document.getElementById("btnEntrar");
    botonEntrar.addEventListener("click",()=>{
        const nombreUsuario = document.getElementById("nombreUsuario").value.trim();;
        if (nombreUsuario === "") {
            alert("Por favor ingresá tu nombre para continuar.");
            return;
        }
        // Si ingresó un nombre, lo guardás o lo redirigís
        sessionStorage.setItem("nombreUsuario", nombreUsuario);
        console.log(nombreUsuario);
        window.location.href = "productos.html";
    })
        
    
