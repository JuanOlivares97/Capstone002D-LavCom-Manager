function toggleModal(idModal,btnAbrirmodal, btnCerrarModal) {
    const modal = document.querySelector(idModal ); // idModal debería ser un selector válido, como '#modalId'
    if (!modal) return; // Verifica si el modal existe

    const openModal = document.querySelector(btnAbrirmodal);
    const closeModal = document.querySelector(btnCerrarModal);

    if (openModal) {
        openModal.addEventListener('click', () => {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.querySelector('.transform').classList.remove('scale-95');
            }, 10);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            modal.querySelector('.transform').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        });
    }
}
