const form = document.getElementById("login-form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = form.querySelector("input[name='username']").value;
    const pwd = form.querySelector("input[name='pwd']").value;

    const response = await fetch("/laundry-manager/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, pwd })
    });

    const data = await response.json();

    if (!data.success) {
        Swal.fire({
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

    if (data.user.email == null) {
        const { value: email } = await Swal.fire({
            title: "No tiene registrado un correo electrónico, ingrese uno",
            input: "email",
            icon: "info",
            inputPlaceholder: "ejemplo@mail.com",
            toast: true,
            position: 'top-end',
        });
        if (email) {
            const response_email = await fetch("/laundry-manager/auth/set-email", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, id_usuario: data.user.id_usuario })
            });
            const data_email = await response_email.json();
            if (!data_email.success) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data_email.message,
                    confirmButtonText: "Reintentar",
                    toast: true,
                    position: 'top-end'
                });
                return;
            }
            console.log(data_email.message)
        }
    }
    Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: data.message,
        timer: 2000, // La alerta se mostrará durante 3 segundos
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false, // No mostrar botón de confirmación
        willClose: () => {
            window.location.href = "/laundry-manager/help/home"; // Redirigir cuando la alerta se cierre
        }
    });
});