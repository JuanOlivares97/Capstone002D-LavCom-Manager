import { AG_GRID_LOCALE_ES } from '../utils.js';
let gridApi; 
document.addEventListener('DOMContentLoaded', async function () {

    try {
        const employee = await fetch('/food-manager/employee/get-funcionarios')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los empleados');
                }
                return response.json();
            });

        const gridOptions = {
            // Datos a mostrar
            rowData: employee,
            localeText: AG_GRID_LOCALE_ES,
            // Definición de columnas
            columnDefs: [
                {
                    headerName: "RUT",
                    field: "rut",  // El RUT ya concatenado como "RutFuncionario-DvFuncionario"
                    flex: 1,
                    filter: true,
                    floatingFilter: true
                },
                {
                    headerName: "Nombre",
                    field: "NombreFuncionario",
                    flex: 1,
                    filter: true,
                    floatingFilter: true,

                },
                {
                    headerName: "Correo",
                    field: "correo",
                    flex: 1,
                    filter: true,
                    floatingFilter: true
                },
                {
                    headerName: "Fecha de Inicio de Contrato",
                    field: "FechaInicioContrato",
                    flex: 1,
                    filter: true,
                    valueFormatter: params => new Date(params.value).toLocaleDateString(),  // Formatear fecha a una cadena legible
                },
                {
                    headerName: "Fecha de Término de Contrato",
                    field: "FechaTerminoContrato",
                    flex: 1,
                    filter: true,
                    valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : 'Indefinido',  // Formatear la fecha o mostrar "Indefinido"
                },
                {
                    headerName: "Tipo de Contrato",
                    field: "TipoContrato.TipoContrato",
                    flex: 1,
                    filter: true,
                    floatingFilter: true
                },
                {
                    headerName: "Estamento",
                    field: "TipoEstamento.DescTipoEstamento",
                    flex: 1,
                    filter: true,
                    floatingFilter: true
                },
                {
                    headerName: "Servicio",
                    field: "TipoServicio.DescTipoServicio",
                    flex: 1,
                    filter: true,
                    floatingFilter: true
                },
                {
                    headerName: "Unidad",
                    field: "TipoUnidad.DescTipoUnidad",
                    flex: 1,
                    filter: true,
                    floatingFilter: true
                },
                {
                    headerName: "Estado",
                    field: "Habilitado",
                    cellRenderer: function (params) {
                        return params.value === 'S' ?
                            `<span style="color:green;">✔️</span>` :
                            `<span style="color:red;">❌</span>`;
                    },
                    flex: 1
                },
                {
                    headerName: "Acciones",
                    field: "actions",
                    cellRenderer: function (params) {
                        return `
                            <button class="edit bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-sm rounded mr-1" onclick="editUsuario(${JSON.stringify(params.data).replace(/"/g, '&quot;')})">Editar</button>
                            <button class="delete bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm rounded" onclick="deleteUsuario(${JSON.stringify(params.data).replace(/"/g, '&quot;')})">Borrar</button>
                        `;

                    }
                }
            ],
            pagination: true,
            paginationPageSize: 20,
            paginationAutoPageSize: true,
            defaultColDef: {
                resizable: false,
                sortable: true,
                filter: true,
            },
        };

        const gridDiv = document.querySelector("#gridFuncionarios");
        gridApi = agGrid.createGrid(gridDiv, gridOptions);

    } catch (error) {
        console.error("Error cargando los empleados:", error);
        alert("Hubo un error cargando los empleados. Inténtalo nuevamente más tarde.");
    }
});

function capitalizeWords(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Función para editar usuario
window.editUsuario = function (data) {
    const modal = document.getElementById("modal_editar_usuario");

    if (!modal) {
        console.error("El modal no se encontró en el DOM");
        return;
    }
    const idInput = document.getElementById("editIdFuncionario");
    const rutInput = document.getElementById("editRutCompleto");
    const nameInput = document.getElementById("editnombre_usuario");
    const servicioSelect = document.querySelector("select[name='edittipoServicio']");
    const contratoSelect = document.querySelector("select[name='edittipoContrato']");
    const unidadSelect = document.querySelector("select[name='edittipoUnidad']");
    const estamentoSelect = document.querySelector("select[name='edittipoEstamento']");
    const funcionarioSelect = document.querySelector("select[name='edittipoFuncionario']");
    // Verificar que los datos de RUT existan
    const rutCompleto = (data.RutFuncionario && data.DvFuncionario)
        ? `${data.RutFuncionario}-${data.DvFuncionario}`
        : 'Datos de RUT no disponibles';

    if (rutInput && nameInput && servicioSelect && contratoSelect && unidadSelect && estamentoSelect && funcionarioSelect) {
        idInput.value = data.IdFuncionario || '';
        rutInput.value = rutCompleto;
        nameInput.value = capitalizeWords(data.NombreFuncionario || 'Nombre no disponible');
        servicioSelect.value = data.TipoServicio?.IdTipoServicio || '';
        contratoSelect.value = data.TipoContrato?.IdTipoContrato || '';
        unidadSelect.value = data.TipoUnidad?.IdTipoUnidad || '';
        estamentoSelect.value = data.TipoEstamento?.IdTipoEstamento || '';
        funcionarioSelect.value = data.IdTipoFuncionario !== null && data.IdTipoFuncionario !== undefined ? data.IdTipoFuncionario : '';

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10);

        if (document.getElementById('closeModalEditUser').addEventListener('click', () => {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        })) {
            console.error("No se pudo agregar el event listener para cerrar el modal");
        }
    } else {
        console.error("Algunos elementos del formulario no se encontraron en el DOM");
    }
};

document.getElementById('formEditarEmpleado').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir el envío por defecto del formulario

    // Obtener los valores de los campos
    const idInput = document.getElementById('editIdFuncionario').value;
    const rutCompleto = document.getElementById('editRutCompleto').value;
    const nombreUsuario = document.getElementById('editnombre_usuario').value;
    const tipoServicio = document.querySelector("select[name='edittipoServicio']").value;
    const tipoContrato = document.querySelector("select[name='edittipoContrato']").value;
    const tipoUnidad = document.querySelector("select[name='edittipoUnidad']").value;
    const tipoEstamento = document.querySelector("select[name='edittipoEstamento']").value;
    const tipoFuncionario = document.querySelector("select[name='edittipoFuncionario']").value;

    // Dividir el RUT en número y dígito verificador
    const [rutUsuario, dvUsuario] = rutCompleto.split('-');

    // Crear un objeto con los datos
    const data = {
        rut_usuario: rutUsuario,
        dv_usuario: dvUsuario,
        nombre_usuario: nombreUsuario,
        tipoServicio: tipoServicio,
        tipoContrato: tipoContrato,
        tipoUnidad: tipoUnidad,
        tipoEstamento: tipoEstamento,
        tipoFuncionario: tipoFuncionario,
    };

    try {
        // Enviar los datos al backend
        const response = await fetch(`/food-manager/employee/update-empleado/${idInput}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            alert('Usuario modificado con éxito');
            // Lógica adicional si es necesario (por ejemplo, cerrar el modal, recargar datos, etc.)
        } else {
            const errorData = await response.json();
            alert(`Error al modificar el usuario: ${errorData.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un problema al enviar la solicitud. Inténtalo de nuevo más tarde.');
    }
});


window.deleteUsuario = function (data) {
    Swal.fire({
        title: `¿Estás seguro de que deseas borrar al usuario ${data.NombreFuncionario}?`,
        text: "¡No podrás revertir esto! ¿Deseas continuar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, bórralo!',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/food-manager/employee/delete-empleado/${data.IdFuncionario}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    Swal.fire(
                        '¡Borrado!',
                        'El usuario ha sido eliminado.',
                        'success'
                    );
                    gridApi.applyTransaction({ remove: [data] }); // Uso de gridApi
                } else {
                    const errorMessage = response.status === 204 ? 'El usuario fue eliminado, pero no hubo contenido de respuesta.' : 'Error al borrar el usuario';
                    alert(errorMessage);
                }
            } catch (error) {
                Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar al usuario. Inténtalo más tarde.' + error,
                    'error'
                );
            }
        }
    });
};
