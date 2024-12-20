function openModalInfo(paciente) {
    // Llenar los campos con los datos del paciente
    document.getElementById('idPaciente').value = paciente.IdHospitalizado;  // Asignar el ID al campo de input
    document.getElementById('infoCama').value = paciente.CodigoCama || ''; // Asignar el valor al campo de input
    document.getElementById('infoNombre').value = paciente.NombreHospitalizado || '';
    document.getElementById('InfoApellido1').value = paciente.ApellidoP || '';
    document.getElementById('infoApellido2').value = paciente.ApellidoM || '';
    document.getElementById('infoObservacionesGenerales').value = paciente.ObservacionesSala || '';
    document.getElementById('infoRut').value = (paciente.RutHospitalizado + '-' + paciente.DvHospitalizado) || '';
    document.getElementById('infoTelefonos').value = paciente.Telefono || '';
    document.getElementById('infoDireccion').value = paciente.Direccion || '';
    document.getElementById('infoCorreo').value = paciente.Correo || '';
    document.getElementById('infoObservacionesNutricionista').value = paciente.ObservacionesNutricionista || '';
    // Asignar valores a los select si existen, de lo contrario, dejar vacío
    document.getElementById('infoUnidad').value = paciente.IdTipoUnidad !== null && paciente.IdTipoUnidad !== undefined ? paciente.IdTipoUnidad : '';
    document.getElementById('infoServicio').value = paciente.IdTipoServicio !== null && paciente.IdTipoServicio !== undefined ? paciente.IdTipoServicio : '';
    document.getElementById('infoVia').value = paciente.IdTipoVia !== null && paciente.IdTipoVia !== undefined ? paciente.IdTipoVia : '';
    document.getElementById('infoRegimen').value = paciente.IdTipoRegimen !== null && paciente.IdTipoRegimen !== undefined ? paciente.IdTipoRegimen : '';




    // Obtener los valores de FechaNacimiento y FechaIngreso del objeto paciente
    const fechaNacimiento = paciente.FechaNacimiento ? new Date(paciente.FechaNacimiento) : null;
    const fechaIngreso = paciente.FechaIngreso ? new Date(paciente.FechaIngreso) : null;

    // Convertir las fechas al formato "YYYY-MM-DD" si existen
    const formattedFechaNacimiento = fechaNacimiento ? fechaNacimiento.toISOString().split('T')[0] : '';
    const formattedFechaIngreso = fechaIngreso ? fechaIngreso.toISOString().split('T')[0] : '';

    // Establecer los valores en los inputs tipo "date"
    document.getElementById('infoFechaNacimiento').value = formattedFechaNacimiento;
    document.getElementById('infoFechaIngreso').value = formattedFechaIngreso;

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
            const response = await fetch(`/food-manager/patient/movements/${patientId}`);

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
function closeModalInfo() {
    // Ocultar el modal
    document.getElementById('patientModal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    // Elemento del botón
    const changeObservacionesGeneralesButton = document.getElementById('changeObservacionesGenerales');
    const changeObservacionesNutricionistaButton = document.getElementById('changeObservacionesNutricionista');
    const changeViaButton = document.getElementById('changeVia');
    const changeRegimenButton = document.getElementById('changeRegimen');
    const changeServicioButton = document.getElementById('changeServicio');
    const changeUnidadButton = document.getElementById('changeUnidad');

    // Verificar que los botones existen antes de añadir el evento
    if (changeObservacionesGeneralesButton) {
        changeObservacionesGeneralesButton.addEventListener('click', sendObservacionesGenerales);
    }

    if (changeObservacionesNutricionistaButton) {
        changeObservacionesNutricionistaButton.addEventListener('click', sendObservacionesNutricionista);
    }

    if (changeViaButton) {
        changeViaButton.addEventListener('click', sendNewVia);
    }

    if (changeRegimenButton) {
        changeRegimenButton.addEventListener('click', sendNewRegimen);
    }

    if (changeServicioButton) {
        changeServicioButton.addEventListener('click', sendNewServicio);
    }

    if(changeUnidadButton){
        changeUnidadButton.addEventListener('click', sendNewUnidad)
    }
    
});

async function sendNewServicio(event) {
    event.preventDefault();

    const newServicio = document.getElementById('infoServicio').value;
    const newCodigoCama = document.getElementById('infoCama').value;
    const idPaciente = document.getElementById('idPaciente').value;

    if (!newServicio || !newCodigoCama || !idPaciente) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe seleccionar un nuevo servicio y ingresar el número de cama',
            confirmButtonText: 'Ok'
        });
        return; // Salir de la función si faltan datos
    }

    const result = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: '¿Deseas cambiar el servicio del paciente?',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        showCancelButton: true
    });

    if (result.isConfirmed) {
        try {
            // Hacer la petición PUT al servidor para actualizar el servicio
            const response = await fetch(`/food-manager/patient/move-service/${idPaciente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newService: newServicio, newCodigoCama: newCodigoCama })
            });

            if (!response.ok) {
                throw new Error('Error al enviar el cambio de servicio');
            }

            await Swal.fire({
                icon: 'success',
                title: 'Actualización exitosa',
                text: 'El servicio del paciente se ha actualizado correctamente',
                confirmButtonText: 'Ok'
            });
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al enviar el cambio de servicio',
                confirmButtonText: 'Ok'
            });
        }
    }
}

async function sendObservacionesGenerales(event) {
    event.preventDefault();

    // Obtener los valores del textarea y del ID del paciente
    const observaciones = document.getElementById('infoObservacionesGenerales').value;
    const idPaciente = document.getElementById('idPaciente').value;

    // Validar si se ingresaron observaciones
    if (!observaciones) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe ingresar observaciones',
            confirmButtonText: 'Ok'
        });
        return;
    }

    // Confirmación de que se enviaron las observaciones
    Swal.fire({
        icon: 'success',
        title: 'Observaciones enviadas',
        text: 'Las observaciones se han enviado correctamente',
        confirmButtonText: 'Ok'
    }).then(async () => {
        try {
            // Hacer la petición PUT al servidor para actualizar las observaciones
            const response = await fetch(`/food-manager/patient/change-observations-sala/${idPaciente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newObservacionesGenerales: observaciones })
            });

            // Verificar si la respuesta del servidor fue exitosa
            if (!response.ok) {
                throw new Error('Error al enviar las observaciones');
            }

            Swal.fire({
                icon: 'success',
                title: 'Actualización exitosa',
                text: 'Las observaciones generales se han actualizado correctamente',
                confirmButtonText: 'Ok'
            });

        } catch (error) {
            // Mostrar alerta en caso de error al enviar las observaciones
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al enviar las observaciones',
                confirmButtonText: 'Ok'
            });
        }
    });
}

async function sendObservacionesNutricionista(event) {
    event.preventDefault();

    // Obtener los valores del textarea y del ID del paciente
    const observacionesNutri = document.getElementById('infoObservacionesNutricionista').value;
    const idPaciente = document.getElementById('idPaciente').value;

    // Validar si se ingresaron observaciones
    if (!observacionesNutri) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe ingresar observaciones',
            confirmButtonText: 'Ok'
        });
        return;
    }

    // Confirmación de que se enviaron las observaciones
    Swal.fire({
        icon: 'success',
        title: 'Observaciones enviadas',
        text: 'Las observaciones se han enviado correctamente',
        confirmButtonText: 'Ok'
    }).then(async () => {
        try {
            // Hacer la petición PUT al servidor para actualizar las observaciones
            const response = await fetch(`/food-manager/patient/change-observations-nutricionista/${idPaciente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newObservacionesNutricionista: observacionesNutri })
            });

            // Verificar si la respuesta del servidor fue exitosa
            if (!response.ok) {
                throw new Error('Error al enviar las observaciones');
            }

            Swal.fire({
                icon: 'success',
                title: 'Actualización exitosa',
                text: 'Las observaciones generales se han actualizado correctamente',
                confirmButtonText: 'Ok'
            });

        } catch (error) {
            // Mostrar alerta en caso de error al enviar las observaciones
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al enviar las observaciones',
                confirmButtonText: 'Ok'
            });
        }
    });
}

async function sendNewVia(event) {
    event.preventDefault();

    // Obtener los valores del select y del ID del paciente
    const newVia = document.getElementById('infoVia').value;
    const idPaciente = document.getElementById('idPaciente').value;

    // Validar si se ha seleccionado una vía válida
    if (!newVia || newVia === "no-usar") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe seleccionar una nueva vía de ingesta de alimentos',
            confirmButtonText: 'Ok'
        });
        return;
    }

    try {
        // Hacer la petición PUT al servidor para actualizar la vía
        const response = await fetch(`/food-manager/patient/change-via/${idPaciente}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newVia: parseInt(newVia) })
        });

        // Verificar si la respuesta del servidor fue exitosa
        if (!response.ok) {
            throw new Error('Error al enviar el cambio de vía de ingesta de alimentos');
        }

        // Mostrar mensaje de éxito si la solicitud fue correcta
        Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: 'La vía de ingesta de alimentos se ha actualizado correctamente',
            confirmButtonText: 'Ok'
        });

    } catch (error) {
        // Mostrar alerta en caso de error al enviar la solicitud
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al enviar el cambio de vía de ingesta de alimentos',
            confirmButtonText: 'Ok'
        });
    }
}

async function sendNewRegimen(event) {
    event.preventDefault();

    // Obtener los valores del select y del ID del paciente
    const newRegimen = document.getElementById('infoRegimen').value;
    const idPaciente = document.getElementById('idPaciente').value;

    // Validar si se ha seleccionado un nuevo régimen
    if (!newRegimen || newRegimen === "no-usar") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe seleccionar un nuevo régimen',
            confirmButtonText: 'Ok'
        });
        return;
    }

    // Convertir el valor del régimen en número y verificar que sea válido
    const newRegimenValue = parseInt(newRegimen);
    if (isNaN(newRegimenValue)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El valor seleccionado no es válido',
            confirmButtonText: 'Ok'
        });
        return;
    }

    try {
        // Hacer la petición PUT al servidor para actualizar el régimen
        const response = await fetch(`/food-manager/patient/change-regimen/${idPaciente}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newRegimen: newRegimenValue })
        });

        // Verificar si la respuesta del servidor fue exitosa
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al enviar el cambio de régimen');
        }

        // Mostrar mensaje de éxito si la solicitud fue correcta
        Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: 'El régimen se ha actualizado correctamente',
            confirmButtonText: 'Ok'
        });

    } catch (error) {
        // Mostrar alerta en caso de error al enviar la solicitud y loguear el error
        console.error('Error al actualizar el régimen:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error al enviar el cambio de régimen: ${error.message}`,
            confirmButtonText: 'Ok'
        });
    }
}

async function sendNewUnidad(event) {
    event.preventDefault();

    // Obtener los valores del select y del ID del paciente
    const newUnidad = document.getElementById('infoUnidad').value;
    const idPaciente = document.getElementById('idPaciente').value;

    // Convertir el valor del régimen en número y verificar que sea válido
    const newUnidadValue = parseInt(newUnidad);
    if (isNaN(newUnidadValue)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El valor seleccionado no es válido',
            confirmButtonText: 'Ok'
        });
        return;
    }

    try {
        // Hacer la petición PUT al servidor para actualizar el régimen
        const response = await fetch(`/food-manager/patient/change-unidad/${idPaciente}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newUnidad: newUnidadValue })
        });

        // Verificar si la respuesta del servidor fue exitosa
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al enviar el cambio de régimen');
        }

        // Mostrar mensaje de éxito si la solicitud fue correcta
        Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: 'La Unidad se ha actualizado correctamente',
            confirmButtonText: 'Ok'
        });

    } catch (error) {
        // Mostrar alerta en caso de error al enviar la solicitud y loguear el error
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error al enviar el cambio de Unidad: ${error.message}`,
            confirmButtonText: 'Ok'
        });
    }
}
