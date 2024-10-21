function openModal(paciente) {
    // Llenar los campos con los datos del paciente
    document.getElementById('idPaciente').value = paciente.IdHospitalizado;  // Asignar el ID al campo de input
    document.getElementById('infoCama').value = paciente.CodigoCama || ''; // Asignar el valor al campo de input
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

    const logMovimientosPaciente = document.getElementById('logMovimientosPaciente');
    const movimientosList = document.getElementById('movimientosList');

    // Reiniciar los datos de los logs
    movimientosList.innerHTML = '';
    logMovimientosPaciente.classList.add('hidden');
}

async function toggleLogs() {
    const logMovimientosPaciente = document.getElementById('logMovimientosPaciente');
    const movimientosList = document.getElementById('movimientosList');

    if (logMovimientosPaciente.classList.contains('hidden')) {
        logMovimientosPaciente.classList.remove('hidden');

        // Aquí se hace la solicitud al servidor para obtener los movimientos del paciente
        try {
            const patientId = document.getElementById('idPaciente').value;
            if (!patientId) {
                throw new Error('No se ha proporcionado el ID del paciente');
            }
            const response = await fetch(`/patient/movements/${patientId}`);

            if (!response.ok) {
                throw new Error('Error al obtener los movimientos del paciente');
            }

            const movimientos = await response.json();

            // Llenar los logs con los datos obtenidos
            movimientosList.innerHTML = ''; // Limpiar la lista primero

            movimientos.forEach(movimiento => {
                const movimientoItem = document.createElement('li');
                movimientoItem.classList.add('p-3', 'bg-white', 'rounded-lg', 'shadow');
                movimientoItem.innerHTML = `
                    <p class="font-semibold">Fecha: ${new Date(movimiento.fechaLog).toLocaleDateString()}</p>
                    <p>Descripción: ${movimiento.descripcionLog}</p>
                `;
                movimientosList.appendChild(movimientoItem);
            });

        } catch (error) {
            console.error('Hubo un problema al cargar los movimientos:', error);
        }
    } else {
        logMovimientosPaciente.classList.add('hidden');
    }
}
function closeModal() {
    // Ocultar el modal
    document.getElementById('patientModal').classList.add('hidden');
}

function filterByUnit(unit) {
    const cards = document.querySelectorAll('#cardGridPacientes > div');
    cards.forEach(card => {
        if (card.getAttribute('data-unidad') === unit) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Elimina tildes
}

function searchByName(event) {
    event.preventDefault();
    const query = removeAccents(document.getElementById('searchQuery').value.toLowerCase());
    const cards = document.querySelectorAll('#cardGridPacientes > div');

    cards.forEach(card => {
        const nombre = removeAccents(card.querySelector('h2').textContent.toLowerCase());
        if (nombre.includes(query)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function searchByRut() {
    const query = document.getElementById('rutInput').value.trim();
    console.log(query);
    const cards = document.querySelectorAll('#cardGridPacientes > div');
    cards.forEach(card => {
        const rut = card.querySelector('#rutSpan').textContent.trim();
        if (rut === query) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function formatRut(input) {
    let value = input.value.replace(/\./g, '').replace(/-/g, ''); // Eliminar puntos y guión anteriores
    if (value.length > 1) {
        value = value.slice(0, -1).replace() + '-' + value.slice(-1);
    }
    input.value = value;
}

