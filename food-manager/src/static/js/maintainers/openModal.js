document.addEventListener('DOMContentLoaded', function () {
    const filtroLinks = document.querySelectorAll('.filtro-link');

    filtroLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = e.target.getAttribute('data-filter');

            // Obtener todas las tarjetas
            const cards = document.querySelectorAll('.card-item');

            // Mostrar u ocultar las tarjetas según el filtro seleccionado
            cards.forEach(card => {
                if (card.classList.contains(filter)) {
                    card.classList.remove('hidden'); // Mostrar tarjeta
                } else {
                    card.classList.add('hidden'); // Ocultar tarjeta
                }
            });
        });
    });

    // Asigna eventos de clic a las tarjetas de agregar item
    document.querySelectorAll('.addItem').forEach(card => {
        card.addEventListener('click', () => {
            // Usa el valor del atributo data-filter para determinar el mantenedor
            const mantenedor = card.classList.contains('Vias') ? 'Vias' :
                               card.classList.contains('Perfiles') ? 'Perfiles' :
                               card.classList.contains('Estamento') ? 'Estamentos' :
                               card.classList.contains('Unidad') ? 'Unidades' :
                               card.classList.contains('Servicios') ? 'Servicios' :
                               card.classList.contains('Contratos') ? 'Contratos' :
                               card.classList.contains('Regimen') ? 'Regimen' : '';

            openModal(mantenedor);
        });
    });

    // Función para abrir el modal con el contenido correspondiente
    function openModal(mantenedor) {
        const modal = document.getElementById('modalAddMaintainer');
        const modalTitle = document.getElementById('modalTitle');
        const formContent = document.getElementById('formContent');

        // Establece el título del modal según el mantenedor seleccionado
        modalTitle.textContent = `Agregar ${mantenedor}`;

        // Limpia el contenido del formulario antes de agregar nuevos campos
        formContent.innerHTML = '';

        // Define los campos del formulario según el mantenedor seleccionado
        let fields = [];
        switch (mantenedor) {
            case 'Estamentos':
                fields = [{ label: 'Descripción de Estamento', type: 'text', name: 'DescTipoEstamento' }];
                break;
            case 'Unidades':
                fields = [{ label: 'Descripción de Unidad', type: 'text', name: 'DescTipoUnidad' }];
                break;
            case 'Servicios':
                fields = [{ label: 'Descripción de Servicio', type: 'text', name: 'DescTipoServicio' }];
                break;
            case 'Contratos':
                fields = [{ label: 'Tipo de Contrato', type: 'text', name: 'TipoContrato' }];
                break;
            case 'Vias':
                fields = [{ label: 'Descripción de Vía de Alimentación', type: 'text', name: 'DescTipoVia' }];
                break;
            case 'Perfiles':
                fields = [{ label: 'Perfil del Funcionario', type: 'text', name: 'TipoPerfil' }];
                break;
            case 'Regimen':
                fields = [{ label: 'Descripción de Régimen', type: 'text', name: 'DescTipoRegimen' }];
                break;
        }

        // Añade los campos al formulario
        fields.forEach(field => {
            const fieldElement = document.createElement('div');
            fieldElement.className = 'flex flex-col';
            fieldElement.innerHTML = `
                <label class="text-gray-700">${field.label}</label>
                <input type="${field.type}" name="${field.name}" class="border rounded p-2" required>
            `;
            formContent.appendChild(fieldElement);
        });

        // Muestra el modal
        modal.classList.remove('hidden');
    }
});

// Asigna eventos de clic a las tarjetas de agregar item
document.querySelectorAll('.addItem').forEach(card => {
    card.addEventListener('click', () => {
        const mantenedor = card.classList.contains('Estamento') ? 'Estamentos' :
            card.classList.contains('Unidad') ? 'Unidades' :
                card.classList.contains('Servicios') ? 'Servicios' :
                    card.classList.contains('Contratos') ? 'Contratos' :
                        card.classList.contains('Vias') ? 'Vias de Alimentación' :
                            card.classList.contains('Perfiles') ? 'Perfiles de Funcionarios' :
                                card.classList.contains('Regimen') ? 'Regimen' : '';
        openModal(mantenedor);
    });
});

// Captura el envío del formulario y realiza la solicitud al backend
document.getElementById('modalForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Previene el comportamiento por defecto de recargar la página

    const mantenedor = document.getElementById('modalTitle').textContent.split(' ')[1].toLowerCase();
    let endpoint;

    // Asigna el endpoint según el mantenedor seleccionado
    switch (mantenedor) {
        case 'estamentos':
            endpoint = '/food-manager/maintainer/create-estamento';
            break;
        case 'unidades':
            endpoint = '/food-manager/maintainer/create-unidad';
            break;
        case 'servicios':
            endpoint = '/food-manager/maintainer/create-servicio';
            break;
        case 'contratos':
            endpoint = '/food-manager/maintainer/create-contrato';
            break;
        case 'vias':
            endpoint = '/food-manager/maintainer/create-via';
            break;
        case 'perfiles':
            endpoint = '/food-manager/maintainer/create-tipo-funcionario';
            break;
        case 'regimen':
            endpoint = '/food-manager/maintainer/create-regimen';
            break;
        default:
            alert("Mantenedor no reconocido");
            return;
    }

    // Crea un objeto con los datos del formulario
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        // Envía los datos al servidor con fetch
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Leer la respuesta solo una vez
        const result = await response.json();

        if (response.ok) {
            // SweetAlert para éxito
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: `${mantenedor} creado exitosamente`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(() => {
                closeModal(); // Cierra el modal después de confirmar
            });
        } else {
            // SweetAlert para error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al crear el ${mantenedor}: ${result.error || 'Error desconocido'}`,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        }

    } catch (error) {
        // SweetAlert para error de conexión
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: `Error al conectar con el servidor: ${error.message}`,
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
        });
    }
});

// Función para cerrar el modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Función para abrir el modal de edición con la información del item seleccionado
function editItem(id, mantenedor, description) {
    const modal = document.getElementById('modalEditMaintainer');
    const modalTitle = document.getElementById('modalEditTitle');
    const formContent = document.getElementById('formEditContent');

    // Establece el título del modal según el mantenedor seleccionado
    modalTitle.textContent = `Editar ${mantenedor}`;

    // Limpia el contenido del formulario antes de agregar nuevos campos
    formContent.innerHTML = `
        <input type="hidden" name="id" value="${id}">
        <label class="text-gray-700">Descripción de ${mantenedor}</label>
        <input type="text" name="description" value="${description}" class="border rounded p-2" required>
    `;

    // Muestra el modal
    modal.classList.remove('hidden');
}

// Captura el envío del formulario de edición y realiza la solicitud al backend
document.getElementById('modalEditForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Previene el comportamiento por defecto de recargar la página

    const formData = new FormData(event.target);
    const id = formData.get('id');
    const description = formData.get('description');
    const mantenedor = document.getElementById('modalEditTitle').textContent.split(' ')[1].toLowerCase();
    let endpoint, idField;
    console.log(description);
    // Asigna el endpoint y el nombre del campo ID según el mantenedor seleccionado
    switch (mantenedor) {
        case 'estamento':
            endpoint = `/food-manager/maintainer/update-estamento/${id}`;
            idField = 'IdTipoEstamento';
            dataField = 'DescTipoEstamento';
            break;
        case 'unidad':
            endpoint = `/food-manager/maintainer/update-unidad/${id}`;
            idField = 'IdTipoUnidad';
            dataField = 'DescTipoUnidad';
            break;
        case 'servicio':
            endpoint = `/food-manager/maintainer/update-servicio/${id}`;
            idField = 'IdTipoServicio';
            dataField = 'DescTipoServicio';
            break;
        case 'contrato':
            endpoint = `/food-manager/maintainer/update-contrato/${id}`;
            idField = 'IdTipoContrato';
            dataField = 'TipoContrato';
            break;
        case 'via':
            endpoint = `/food-manager/maintainer/update-via/${id}`;
            idField = 'IdTipoVia';
            dataField = 'DescTipoVia';
            break;
        case 'perfil':
            endpoint = `/food-manager/maintainer/update-tipo-funcionario/${id}`;
            idField = 'IdTipoFuncionario';
            dataField = 'TipoPerfil';
            break;
        case 'regimen':
            endpoint = `/food-manager/maintainer/update-regimen/${id}`;
            idField = 'IdTipoRegimen';
            dataField = 'DescTipoRegimen';
            break;
        default:
            alert("Mantenedor no reconocido");
            return;
    }

    // Envía los datos al servidor con fetch
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [idField]: idField, [dataField]: description })
        });

        if (response.ok) {
            // Muestra mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: `${mantenedor} actualizado exitosamente`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(() => {
                closeModal(); // Cierra el modal después de confirmar
            });
        } else {
            const error = await response.json();
            // Muestra mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al actualizar el ${mantenedor}: ${error.error}`,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        // Muestra mensaje de error de conexión
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: `Error al conectar con el servidor: ${error.message}`,
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
        });
    }
});

// Función para eliminar un item
async function deleteItem(id, mantenedor) {
    let endpoint;

    // Determina el endpoint según el tipo de mantenedor
    switch (mantenedor) {
        case 'Regimen':
            endpoint = `/food-manager/maintainer/delete-regimen/${id}`;
            break;
        case 'Servicio':
            endpoint = `/food-manager/maintainer/delete-servicio/${id}`;
            break;
        case 'Unidad':
            endpoint = `/food-manager/maintainer/delete-unidad/${id}`;
            break;
        default:
            alert("Mantenedor no reconocido");
            return;
    }

    try {
        // Confirmación de eliminación con SweetAlert
        const confirmation = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo'
        });

        if (confirmation.isConfirmed) {
            // Realiza la solicitud DELETE
            const response = await fetch(endpoint, {
                method: 'DELETE'
            });

            if (response.ok) {
                // SweetAlert para éxito
                Swal.fire(
                    '¡Eliminado!',
                    'El item ha sido eliminado exitosamente.',
                    'success'
                ).then(() => {
                    // Opcional: recargar la página o actualizar la vista
                    location.reload();
                });
            } else {
                const error = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error al eliminar el item: ${error.error}`,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                });
            }
        }
    } catch (error) {
        // SweetAlert para error de conexión
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: `Error al conectar con el servidor: ${error.message}`,
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
        });
    }
}
