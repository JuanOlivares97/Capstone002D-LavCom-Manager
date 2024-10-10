function openModal(paciente) {
    // Llenar los campos con los datos del paciente
    document.getElementById('modalNombre').textContent = paciente.nombre;
    document.getElementById('modalApellido1').value = paciente.apellido1 || '';
    document.getElementById('modalApellido2').value = paciente.apellido2 || '';
    document.getElementById('modalFechaNacimiento').value = paciente.fecha_nacimiento || '';
    document.getElementById('modalTelefonos').value = paciente.telefonos || '';
    document.getElementById('modalDireccion').value = paciente.direccion || '';
    document.getElementById('modalDNI').value = paciente.dni || '';
    document.getElementById('modalCorreo').value = paciente.correo || '';

    // Mostrar el modal
    document.getElementById('patientModal').classList.remove('hidden');
}

function closeModal() {
    // Ocultar el modal
    document.getElementById('patientModal').classList.add('hidden');
}

function filterByUnit(unit) {
    const cards = document.querySelectorAll('#cardGrid > div');
    cards.forEach(card => {
        if (card.getAttribute('data-unidad') === unit) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Elimina tildes
}

function searchByName(event) {
    event.preventDefault();
    const query = removeAccents(document.getElementById('searchQuery').value.toLowerCase());
    const cards = document.querySelectorAll('#cardGrid > div');

    cards.forEach(card => {
        const nombre = removeAccents(card.querySelector('h2').textContent.toLowerCase());
        if (nombre.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchByRut() {
    const query = document.getElementById('searchRut').value;
    const cards = document.querySelectorAll('#cardGrid > div');
    cards.forEach(card => {
        const rut = card.querySelector('span').textContent;
        if (rut === query) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function formatRut(input) {
    let value = input.value.replace(/\./g, '').replace(/-/g, ''); // Eliminar puntos y guión anteriores
    if (value.length > 1) {
        value = value.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + value.slice(-1);
    }
    input.value = value;
}