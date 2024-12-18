document.querySelectorAll('#form_nueva_pwd input[type="text"]').forEach((input, index, inputs) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('paste', (event) => {
        event.preventDefault();
        const paste = (event.clipboardData || window.clipboardData).getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, i) => {
            if (index + i < inputs.length) {
                inputs[index + i].value = char;
            }
        });
        inputs[Math.min(index + pasteArray.length, inputs.length - 1)].focus();
    });
});

document.getElementById('form_nueva_pwd').addEventListener('submit', async function(event) {
    event.preventDefault();
    const inputs = document.querySelectorAll('#form_nueva_pwd input[type="text"]');
    let code = '';
    inputs.forEach(input => {
        code += input.value;
    });
    const pwd1 = document.querySelector('input[name="pwd1"]').value;
    const pwd2 = document.querySelector('input[name="pwd2"]').value;
    if (pwd1 !== pwd2) {
        Swal.fire({
            icon: "error",
            title: "Las contraseñas no coinciden, intenta de nuevo",
            timer: 2000, // La alerta se mostrará durante 3 segundos
            timerProgressBar: true,
            toast: true,
            position: 'top-end',
            showConfirmButton: false, // No mostrar botón de confirmación
        });
        return;
    }
    await fetch("/laundry-manager/auth/change-pwd", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, pwd: pwd1 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: data.message,
                timer: 2000,
                timerProgressBar: true,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
            });
            setTimeout(() => {
                window.location.href = "/laundry-manager/auth/login";
            }, 2000);
        } else {
            Swal.fire({
                icon: "error",
                title: data.message,
                timer: 2000,
                timerProgressBar: true,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
            });
        }
    })
});