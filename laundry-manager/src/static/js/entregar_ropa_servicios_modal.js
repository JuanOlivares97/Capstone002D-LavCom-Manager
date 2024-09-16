function openEntregarServiciosModal() {
    const modal = document.querySelector('#entregar_ropa_servicios_modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 100);
}

function addArticuloEntregaServicio() {
    
}

document.addEventListener("DOMContentLoaded", function() {
    const modal = document.querySelector('#entregar_ropa_servicios_modal');
    const closeModal = document.querySelector('#closeModalEntregarRopaServicios');

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