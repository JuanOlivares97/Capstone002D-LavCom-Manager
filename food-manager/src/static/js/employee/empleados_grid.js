import { AG_GRID_LOCALE_ES } from '../utils.js';
document.addEventListener('DOMContentLoaded', async function () {
    let gridApi;

    try {
        const employee = await fetch('/employee/get-funcionarios')
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
    const modal = document.getElementById("editar_usuario_modal");

    const modalTitle = modal.getElementsByTagName("h2");
    modalTitle[0].innerText = `Editar Usuario con RUT ${data.rut}`;

    const rutInput = modal.querySelector("input[name='rut']");
    const nameInput = modal.querySelector("input[name='nombre']");
    const contratoInput = modal.querySelector("select[name='tipo_contrato']");

    rutInput.value = data.rut;
    nameInput.value = data.nombre;
    contratoInput.value = data.tipo_contrato;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 10);
}

window.deleteUsuario = function (data) {
    Swal.fire({
        title: `¿Estás seguro de que deseas borrar al usuario ${data.nombre}?`,
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
                const response = await fetch(`/api/employees/delete-funcionario/${data.rut}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    Swal.fire(
                        '¡Borrado!',
                        'El usuario ha sido eliminado.',
                        'success'
                    );
                    gridApi.applyTransaction({ remove: [data] });
                } else {
                    throw new Error('Error al borrar el usuario');
                }
            } catch (error) {
                Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar al usuario. Inténtalo más tarde.',
                    'error'
                );
            }
        }
    });
};
