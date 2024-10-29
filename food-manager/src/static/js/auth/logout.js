const logoutButtons = [document.getElementById('btn-logout-pc'), document.getElementById('btn-logout-mobile')];

logoutButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevenir la acción predeterminada del botón
        console.log('Logout button clicked');
        const response = await fetch("/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data.success) {
            let timerInterval;
            Swal.fire({
                title: 'Sesión Cerrada',
                html: 'Serás redirigido en <b></b> segundos.',
                icon: 'success',
                timer: 2000, // Tiempo total en milisegundos (3 segundos)
                timerProgressBar: true,
                didOpen: () => {
                    // Actualizamos el texto de la cuenta regresiva cada segundo
                    const b = Swal.getHtmlContainer().querySelector('b');
                    timerInterval = setInterval(() => {
                        b.textContent = Math.ceil(Swal.getTimerLeft() / 1000); // Tiempo restante en segundos
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then(() => {
                window.location.href = "/auth/login"; // Redirigir al login después de la alerta
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data.message,
                confirmButtonText: "Ok",
                toast: true,
                position: 'bottom-end'
            });
        }
    });
});