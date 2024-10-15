function openModal(paciente) {
    // Llenar los campos con los datos del paciente
    document.getElementById('infoCama').textContent = paciente.CodigoCama;
    document.getElementById('infoNombre').value = paciente.NombreHospitalizado || '';
    document.getElementById('InfoApellido1').value = paciente.ApellidoP || '';
    document.getElementById('infoApellido2').value = paciente.ApellidoM || '';
    document.getElementById('infoFechaNacimiento').value = paciente.FechaNacimiento || '';
    document.getElementById('infoObservacionesGenerales').value = paciente.ObservacionesSala || '';
    document.getElementById('infoFechaIngreso').value = paciente.FechaIngreso || '';
    document.getElementById('infoRut').value = (paciente.RutHospitalizado + '-' + paciente.DvHospitalizado) || '';
    document.getElementById('infoTelefonos').value = paciente.Telefono || '';
    document.getElementById('infoDireccion').value = paciente.Direccion || '';
    document.getElementById('infoCorreo').value = paciente.Correo || '';
    document.getElementById('infoObservacionesNutricionista').value = paciente.ObservacionesNutricionista || '';
    document.getElementById('infoFechaAlta').value = paciente.FechaAlta || '';
    document.getElementById('infoServicioAlta').value = paciente.ServicioAlta || ''; 
    document.getElementById('infoNroCama').value = paciente.CodigoCamaAlta || '';
    document.getElementById('infoObservacionesAlta').value = paciente.ObservacionesAlta || '';
    document.getElementById('infoUnidad').value = paciente.IdTipoUnidad || '';
    document.getElementById('infoServicio').value = paciente.IdTipoServicio || '';
    document.getElementById('infoVia').value = paciente.IdTipoVia || '';
    document.getElementById('infoRegimen').value = paciente.IdTipoRegimen || '';

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