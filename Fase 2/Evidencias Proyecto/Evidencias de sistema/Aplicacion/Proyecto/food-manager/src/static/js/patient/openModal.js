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

    toggleModal('#addPatientModal','#addPatient','#closeModalAddPatient')
});