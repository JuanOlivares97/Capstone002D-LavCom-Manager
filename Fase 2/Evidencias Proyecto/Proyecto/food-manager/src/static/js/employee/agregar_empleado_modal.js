document.addEventListener('DOMContentLoaded', () => {
    function toggleModal(idModal, btnAbrirModal, btnCerrarModal) {
        const modal = document.querySelector(idModal);
        const openModal = document.querySelector(btnAbrirModal);
        const closeModal = document.querySelector(btnCerrarModal);

        if (!modal || !openModal || !closeModal) return;

        openModal.addEventListener('click', () => {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
            }, 10);
        });

        closeModal.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        });
    }

    toggleModal('#modal_crear_usuario','#openModalAddUser','#closeModalAddUser')
});

// Cerrar modal al hacer clic fuera
function closeModalIfClickedOutside(event) {
    const modal = document.getElementById('modal_crear_usuario');
    modal.classList.add('hidden');
    modal.classList.remove('opacity-100');
}
async function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(event.target.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            Swal.fire({
                title: 'Éxito',
                text: 'Empleado creado exitosamente',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } else {
            const error = await response.json();
            Swal.fire({
                title: 'Error',
                text: error.message || 'Hubo un problema al crear el empleado',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Error de red o del servidor' + error,
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
}

// Añadir el event listener al formulario
const formElement = document.getElementById('formCrearEmpleado');
formElement.addEventListener('submit', submitForm);