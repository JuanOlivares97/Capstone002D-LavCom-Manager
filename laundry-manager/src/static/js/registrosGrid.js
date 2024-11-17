import { AG_GRID_LOCALE_ES } from "./utils.js";
document.addEventListener("DOMContentLoaded", async function() {
    let gridApi;
    const responseRegistros = await fetch('/laundry-manager/clothes/get-records');
    const registros = await responseRegistros.json();

    const gridOptions = {
        rowData: registros.registros,
        localeText: AG_GRID_LOCALE_ES,
        columnDefs: [
            { headerName: "#", field: "id_registro", flex: 1 },
            { headerName: "Tipo", field: "tipo_registro.tipo_registro", flex: 1 },
        ],
        defaultColDef: {
            resizable: false,
            sortable: true,
            filter: true,
        },
        pagination: true,
        paginationPageSize: 13,
        onRowClicked: function (params) {
            Swal.fire({
                title: "Información del registro #" + params.data.id_registro,
                html: `
                    <p><strong>Tipo:</strong> ${params.data.tipo_registro.tipo_registro}</p>
                    ${params.data.id_unidad_sigcom !== null && params.data.id_unidad_sigcom !== undefined ? `<p><strong>Unidad SIGCOM:</strong> ${params.data.unidad_sigcom.unidad_sigcom}</p>` : ''}
                    <p><strong>Fecha:</strong> ${params.data.fecha}</p>
                    <p><strong>Responsable del registro:</strong> ${params.data.usuarios_registro_rut_usuario_1Tousuarios.nombre}</p>
                    ${params.data.usuarios_registro_rut_usuario_2Tousuarios !== null && params.data.usuarios_registro_rut_usuario_2Tousuarios !== undefined ? `<p><strong>Responsable de entrega/recepción:</strong> ${params.data.usuarios_registro_rut_usuario_2Tousuarios.nombre}</p>` : ''}
                    <hr>
                    <p><strong>Artículos:</strong></p>
                    <ul>
                        ${params.data.detalle_registro.map(detalle => `
                            <li>${detalle.cantidad} x ${detalle.articulo.nombre_articulo}</li>
                        `).join('')}
                    </ul>
                    <hr>
                    ${params.data.observacion !== null && params.data.observacion !== undefined ? `<p><strong>Observaciones:</strong> ${params.data.observacion}</p>` : ''}
                `,
                showCancelButton: true,
                confirmButtonText: "Cerrar"
            })
        }
    };
    const gridDiv = document.querySelector("#grid");
    agGrid.createGrid(gridDiv, gridOptions)
});