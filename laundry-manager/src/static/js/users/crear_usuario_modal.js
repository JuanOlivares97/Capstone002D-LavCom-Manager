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
    });
});