import { AG_GRID_LOCALE_ES } from "./utils.js";
document.addEventListener("DOMContentLoaded", async function() {
    let gridApi;
    const responseRegistros = await fetch('/laundry-manager/reports/get-records');
    const registros = await responseRegistros.json();

    const gridOptions = {
        rowData: registros.registros,
        localeText: AG_GRID_LOCALE_ES,
        columnDefs: [
            { headerName: "#", field: "id_registro", flex: 1 },
            { headerName: "Tipo", field: "tipo_registro.tipo_registro", flex: 1 },
            { headerName: "Fecha", field: "fecha", flex: 1}
        ],
        defaultColDef: {
            resizable: false,
            sortable: true,
            filter: true,
        },
        pagination: true,
        paginationPageSize: 13,
        onRowClicked: function (params) {
            const html = `
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
            `;
            Swal.fire({
                title: "Información del registro #" + params.data.id_registro,
                html: html,
                showDenyButton: true,
                denyButtonText: 'Cerrar',
                confirmButtonText: 'Imprimir',
            }).then(result => {
                if (result.isConfirmed) {
                    const printWindow = window.open('', '', 'width=800,height=600');
                    printWindow.document.open();
                    printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Impresión de Registro</title>
                            <style>
                                @media print {
                                    @page { 
                                        margin: 0; 
                                    }
                                    body {
                                        margin: 1cm;
                                    }
                                    /* Ocultar elementos que no quieres imprimir */
                                    a, url, .no-print {
                                        display: none !important;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <h3>Información del registro #${params.data.id_registro}</h3>
                            ${html}
                        </body>
                        </html>
                    `);
                    printWindow.document.close();
                    printWindow.focus();
                    printWindow.print();
                    printWindow.close();
                }
            })
        }
    };
    const gridDiv = document.querySelector("#grid");
    agGrid.createGrid(gridDiv, gridOptions)
});