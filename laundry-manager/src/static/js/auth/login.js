const form = document.getElementById("login-form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = form.querySelector("input[name='username']").value;
    const pwd = form.querySelector("input[name='pwd']").value;

    const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, pwd })
    });

    const data = await response.json();

    if (!data.success) {
        Swal .fire({
            icon: "error",
            title: "Error",
            text: data.message,
            confirmButtonText: "Reintentar",
            toast: true,
            position: 'top-end'
        });
        return;
    }

    // disable all inputs, buttons and links
    form.querySelectorAll("input, button, a").forEach((element) => {
        element.classList.add("disabled:opacity-50");
        element.disabled = true;
    });

    Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: data.message,
        timer: 1000, // La alerta se mostrará durante 3 segundos
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false, // No mostrar botón de confirmación
        willClose: () => {
            window.location.href = "/dashboard/home"; // Redirigir cuando la alerta se cierre
        }
    });    
});