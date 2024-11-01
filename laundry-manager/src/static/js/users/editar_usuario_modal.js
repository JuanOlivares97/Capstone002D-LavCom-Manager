document.addEventListener("DOMContentLoaded", function() {
    const modal = document.querySelector('#editar_usuario_modal');
    const closeModal = document.querySelector('#closeModalEditUser');

    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    });

    modal.addEventListener("submit", async function (e) {
        e.preventDefault();
    });
});