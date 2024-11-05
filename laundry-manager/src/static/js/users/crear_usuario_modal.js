document.addEventListener("DOMContentLoaded", function() {
    const modal = document.querySelector('#crear_usuario_modal');
    const openModal = document.querySelector('#openModal');
    const closeModal = document.querySelector('#closeModalAddUser');

    openModal.addEventListener('click', () => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10); // Small delay to ensure the class is applied after removing 'hidden'
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    });

    modal.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newUser = Object.fromEntries(formData);
        
        const valid = Fn.validaRut(newUser.rut_usuario);
        
        if (!valid) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `El rut ${newUser.rut_usuario} es inválido`,
                toast: true,
                position: 'top-end',
            })
            return;
        }

        const response = await fetch('/laundry-manager/users/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        const data = await response.json();

        if (!data.success) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message,
                toast: true,
                position: 'top-end',
            });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: data.message,
        }).then(() => {
            modal.classList.add('hidden');
            const gridData = {
                ...data.user,
                rut: `${data.user.rut_usuario}-${data.user.dv_usuario}`,
            }
            window.gridApi.applyTransaction({ add: [gridData] });
            e.target.reset();
        })
    });
});