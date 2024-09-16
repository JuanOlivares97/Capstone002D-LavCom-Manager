document.addEventListener("DOMContentLoaded", function() {
    const modal = document.querySelector('#editar_articulo_modal');
    const closeModal = document.querySelector('#closeModalEditarArticulo');

    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Duration should match the CSS transition duration
    });

    modal.addEventListener('click', (e) => {
        if (event.target === modal) {
            modal.classList.add('opacity-0');
            modal.querySelector('.transform').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300); // Duration should match the CSS transition duration
        }
    });

    modal.addEventListener("submit", function (e) {
        e.preventDefault();
        // form data
        const formData = new FormData(e.target);
        alert(JSON.stringify(Object.fromEntries(formData), null, 2));
    });
});