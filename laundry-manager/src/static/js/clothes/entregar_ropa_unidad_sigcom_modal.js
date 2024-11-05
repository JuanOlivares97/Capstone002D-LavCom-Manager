function openEntregarUnidadSigcomModal() {
    const modal = document.querySelector('#entregar_ropa_unidad_sigcom_modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 100);
}

let rowIdEntregaUnidadSigcom = 0;
async function addArticuloEntregarUnidadSigcom() {
    rowIdEntregaUnidadSigcom++;
    const newRow = document.createElement('div');
    newRow.className = 'flex items-center space-x-2 mt-2';
    newRow.innerHTML = `
      <span class="text-sm font-semibold row-number">${rowIdEntregaUnidadSigcom}</span>
      <select class="flex-grow p-2 border rounded" name="articulo_${rowIdEntregaUnidadSigcom}" required>
        <option value="">Seleccionar artículo</option>
        <!-- Agregar opciones dinámicamente desde el servidor -->
      </select>
      <input type="number" name="cantidad_${rowIdEntregaUnidadSigcom}" class="w-28 p-2 border rounded" placeholder="Cantidad" required>
      <button type="button" class="bg-red-500 text-white p-2 rounded hover:bg-red-700 remove-articulo-entregar-unidad-sigcom">Borrar</button>
    `;
    document.getElementById('entregar_ropa_unidad_sigcom_container').appendChild(newRow);

    const response = await fetch('/clothes/get-clothes');
    const articulos = await response.json();

    const selectArticulo = newRow.querySelector('select');
    articulos.forEach(articulo => {
        const option = document.createElement('option');
        option.value = articulo.id_articulo;
        option.innerText = articulo.nombre_articulo;
        selectArticulo.appendChild(option);
    });

    newRow.querySelector('.remove-articulo-entregar-unidad-sigcom').addEventListener('click', function() {
        newRow.remove();
        rowIdEntregaUnidadSigcom--;
        updateRowNumbersEntregarServicios();
    });
}

function updateRowNumbersEntregarServicios() {
    const rows = document.querySelectorAll('#entregar_ropa_unidad_sigcom_container > div');
    rows.forEach((row, index) => {
        row.querySelector('.row-number').innerText = index + 1;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const entregar_ropa_unidad_sigcom_form = document.getElementById('entregar_ropa_unidad_sigcom_form');
    const modal = document.querySelector('#entregar_ropa_unidad_sigcom_modal');
    const closeModal = document.querySelector('#closeModalEntregarRopaUnidadSigcom');

    entregar_ropa_unidad_sigcom_form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const articulosData = [];
        const filas = document.querySelectorAll('#entregar_ropa_unidad_sigcom_container > div');
    
        filas.forEach((fila, index) => {
            const select = fila.querySelector('select');
            const input = fila.querySelector('input');
            if (select.value && input.value) {
                articulosData.push({
                    id_articulo: select.value,
                    cantidad: input.value
                });
            }
        });

        let registro_data = {
            //rut_usuario_1: entregar_ropa_unidad_sigcom_form.querySelector("input[name='rut_usuario_1']").value,
            rut_usuario_2: entregar_ropa_unidad_sigcom_form.querySelector("select[name='rut_usuario_2']").value,
            id_unidad_sigcom: entregar_ropa_unidad_sigcom_form.querySelector("select[name='unidad_sigcom']").value,
            articulos: articulosData
        }

        if (articulosData.length !== 0) {
            const response = await fetch('/clothes/entregar-unidad-sigcom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registro_data)
            })
            const data = await response.json();
            if (!data.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message
                });
                return;
            }
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: data.message
            })
            .then(() => {
                modal.classList.add('hidden');
            })
            return;
        }
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe ingresar al menos un artículo'
        });
    });
    
    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Duration should match the CSS transition duration
        // clear all articles
        const container = document.getElementById('entregar_ropa_unidad_sigcom_container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        rowIdEntregaUnidadSigcom = 0;
    });
})

