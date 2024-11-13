import { AG_GRID_LOCALE_ES } from "../utils.js";
document.addEventListener("DOMContentLoaded", async function() {
    let gridApi;
    const responseUsers = await fetch('/laundry-manager/users/get-users');
    const users = await responseUsers.json();

    const gridOptions = {
        rowData: users,
        localeText: AG_GRID_LOCALE_ES,
        columnDefs: [
            { headerName: "#", field: "id_usuario", flex: 1 },
            {
                headerName: "Rut",
                field: "rut",
                valueGetter: function (params) {
                    // Concatenar rut_usuario con dv_usuario
                    return `${params.data.rut_usuario}-${params.data.dv_usuario}`;
                },
                flex: 1,
            },
            { headerName: "Nombre", field: "nombre", flex: 1 },
            {
                headerName: "Acciones",
                field: "actions",
                cellRenderer: function (params) {
                    return `
                        <button class="edit bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-sm rounded mr-1" onclick="editUser(${params.node.rowIndex}, ${JSON.stringify(
                            params.data
                        ).replace(/"/g, "&quot;")})">Editar</button>
                        <button class="delete bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm rounded" onclick="deleteUser(${params.node.rowIndex}, ${JSON.stringify(
                            params.data
                        ).replace(/"/g, "&quot;")})">Borrar</button>
                    `;
                },
                flex: 1,
            }
        ],
        defaultColDef: {
            resizable: false,
            sortable: true,
            filter: true,
        },
        pagination: true,
        paginationPageSize: 13,
    };
    const gridDiv = document.querySelector("#gridForUsers");
    gridApi = agGrid.createGrid(gridDiv, gridOptions);

    window.editUser = function (rowIndex, user) {
        const modal = document.getElementById('editar_usuario_modal');

        // Título del modal
        const modalTitle = modal.getElementsByTagName("h2")[0];
        modalTitle.innerText = `Editar Usuario con RUT: ${user.rut_usuario}-${user.dv_usuario}`;

        // Campos del formulario
        const idUsuarioInput = modal.querySelector("input[name='id_usuario']");
        const rowIndexInput = modal.querySelector("input[name='rowIndex']");
        const rutInput = modal.querySelector("input[id='erut_usuario']");
        const nombreInput = modal.querySelector("input[id='enombre']");
        const servicioInput = modal.querySelector("select[id='eservicio']");
        const contratoInput = modal.querySelector("select[id='etipo_contrato']");
        const estamentoInput = modal.querySelector("select[id='eestamento']");
        const tipoUsuarioInput = modal.querySelector("select[id='etipo_usuario']");
        const usernameInput = modal.querySelector("input[id='eusername']");

        // Asignar valores de los datos
        idUsuarioInput.value = user.id_usuario;
        rowIndexInput.value = rowIndex;
        rutInput.value = `${user.rut_usuario}-${user.dv_usuario}`;
        nombreInput.value = user.nombre;
        servicioInput.value = user.id_servicio;
        contratoInput.value = user.id_tipo_contrato;
        estamentoInput.value = user.id_estamento;
        tipoUsuarioInput.value = user.id_tipo_usuario;
        usernameInput.value = user.username;

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10);
    };

    window.deleteUser = function (rowIndex, user) {
        Swal.fire({
            title: `¿Estás seguro de que deseas borrar al usuario ${user.rut_usuario}-${user.dv_usuario}?`,
            text: "¡No podrás revertir esto! ¿Deseas continuar? ",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, bórralo!",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await fetch("/laundry-manager/users/delete-user", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id_usuario: user.id_usuario }),
                })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.success) {
                        Swal.fire({
                            title: "Error",
                            text: data.message,
                            icon: "error",
                        });
                        return;
                    }
                    Swal.fire(data.message).then(() => {
                        const rowNode = gridApi.getRowNode(rowIndex);
                        gridApi.applyTransaction({ remove: [rowNode.data] });
                    })
                    return;
                });
            }
        });
    };

    window.gridApi = gridApi;
});