function openModal(paciente) {
    // Llenar los campos con los datos del paciente
    document.getElementById('infoCama').textContent = paciente.nroCama;
    document.getElementById('infoNombre').value = paciente.nombre || '';
    document.getElementById('InfoApellido1').value = paciente.apellido1 || '';
    document.getElementById('infoApellido2').value = paciente.apellido2 || '';
    document.getElementById('infoFechaNacimiento').value = paciente.fecha_nacimiento || '';
    document.getElementById('infoObservacionesGenerales').value = paciente.observacion_sala || '';
    document.getElementById('infoFechaIngreso').value = paciente.fecha_ingreso || '';
    document.getElementById('infoRut').value = paciente.rut || '';
    document.getElementById('infoTelefonos').value = paciente.telefonos || '';
    document.getElementById('infoDireccion').value = paciente.direccion || '';
    document.getElementById('infoCorreo').value = paciente.correo || '';
    document.getElementById('infoObservacionesNutricionista').value = paciente.observaciones_nutri || '';
    document.getElementById('infoFechaAlta').value = paciente.fecha_alta || '';
    document.getElementById('infoServicioAlta').value = paciente.servicioalta || ''; 
    document.getElementById('infoNroCama').value = paciente.camaAlta || '';
    document.getElementById('infoObservacionesAlta').value = paciente.observacion_alta || '';
    document.getElementById('infoUnidad').value = paciente.unidad || '';
    document.getElementById('infoServicio').value = paciente.Servicio || '';
    document.getElementById('infoVia').value = paciente.Via || '';
    document.getElementById('infoRegimen').value = paciente.Regimen || '';

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