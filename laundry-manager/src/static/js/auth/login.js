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
        confirmButtonText: "Ingresar",
        toast: true,
        position: 'top-end'
    }).then(() => {
        window.location.href = "/help/home";
    });
});