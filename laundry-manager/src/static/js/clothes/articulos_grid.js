import { AG_GRID_LOCALE_ES } from "../utils.js";
document.addEventListener("DOMContentLoaded", async function () {
    let gridApi;

    const response = await fetch("/clothes/get-clothes");
    const articulos = await response.json();

    const gridOptions = {
        // Data to be displayed
        rowData: articulos,
        localeText: AG_GRID_LOCALE_ES,
        // Columns to be displayed (Should match rowData properties)
        columnDefs: [
            { headerName: "ID", field: "id_articulo", flex: 1 },
            {
                headerName: "Nombre",
                field: "nombre_articulo",
                flex: 1,
                filter: true,
            },
            { field: "stock", flex: 1 },
            {
                field: "subgrupo",
                headerName: "Subgrupo",
                flex: 1,
            },
            {
                headerName: "Acciones",
                field: "actions",
                cellRenderer: function (params) {
                    return `
                        <button class="edit bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-sm rounded mr-1" onclick="editArticulo(${params.node.rowIndex}, ${JSON.stringify(
                            params.data
                        ).replace(/"/g, "&quot;")})">Editar</button>
                        <button class="delete bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm rounded" onclick="deleteArticulo(${params.node.rowIndex}, ${JSON.stringify(
                            params.data
                        ).replace(/"/g, "&quot;")})">Borrar</button>
                    `;
                },
                flex: 1,
            },
        ],
        pagination: true,
        paginationPageSize: 15,
        paginationAutoPageSize: true,
        defaultColDef: {
            resizable: false,
            sortable: true,
            filter: true,
        }
    };

    const gridDiv = document.querySelector("#grid");
    gridApi = agGrid.createGrid(gridDiv, gridOptions);

window.editArticulo = function (rowIndex, data) {
    const modal = document.getElementById("editar_articulo_modal");

    const modalTitle = modal.getElementsByTagName("h2");
    modalTitle[0].innerText = `Editar ${data.nombre_articulo}`;

    const idInput = modal.querySelector("input[name='id_articulo']");
    const rowIndexInput = modal.querySelector("input[name='rowIndex']");
    const nameInput = modal.querySelector("input[name='nombre']");
    const stockInput = modal.querySelector("input[name='stock']");
    const subgrupoInput = modal.querySelector("select[name='subgrupo']");

    idInput.value = data.id_articulo;
    rowIndexInput.value = rowIndex;
    nameInput.value = data.nombre_articulo;
    stockInput.value = data.stock;
    subgrupoInput.value = data.id_subgrupo_ropa;

    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".transform").classList.remove("scale-95");
    }, 10); // Small delay to ensure the class is applied after removing 'hidden'
};

window.deleteArticulo = function (rowIndex, articulo) {
    Swal.fire({
        title: `¿Estás seguro de que deseas borrar el articulo ${articulo.nombre_articulo}?`,
        text: "¡No podrás revertir esto! ¿Deseas continuar? ",
        icon: "warning",
        renderCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, bórralo!",
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch("/clothes/delete-clothes", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_articulo: articulo.id_articulo }),
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