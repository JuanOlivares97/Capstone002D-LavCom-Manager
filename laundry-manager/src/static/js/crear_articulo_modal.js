document.addEventListener("DOMContentLoaded", function() {
    const modal = document.querySelector('#crear_articulo_modal');
    const openModal = document.querySelector('#openModal');
    const closeModal = document.querySelector('#closeModal');

    openModal.addEventListener('click', () => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('.transform').classList.remove('scale-95');
        }, 10); // Small delay to ensure the class is applied after removing 'hidden'
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Duration should match the CSS transition duration
    });
});