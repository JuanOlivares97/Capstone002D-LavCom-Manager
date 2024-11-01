function openDarRopaDeBajaModal() {
    const modal = document.querySelector('#dar_ropa_de_baja_modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 100);
}

let rowIdDarRopaDeBaja = 0;
async function addArticuloDarRopaDeBaja() {
    rowIdDarRopaDeBaja++;
    const newRow = document.createElement('div');
    newRow.className = 'flex items-center space-x-2 mt-2';
    newRow.innerHTML = `
      <span class="text-sm font-semibold row-number">${rowIdDarRopaDeBaja}</span>
      <select class="flex-grow p-2 border rounded" name="articulo_${rowIdDarRopaDeBaja}" required>
        <option value="">Seleccionar artículo</option>
        <!-- Agregar opciones dinámicamente desde el servidor -->
      </select>
      <input type="number" name="cantidad_${rowIdDarRopaDeBaja}" class="w-28 p-2 border rounded" placeholder="Cantidad" required>
      <button type="button" class="bg-red-500 text-white p-2 rounded hover:bg-red-700 remove-articulo-dar-ropa-de-baja">Borrar</button>
    `;
    document.getElementById('dar_ropa_de_baja_container').appendChild(newRow);

    const response = await fetch('/clothes/get-clothes');
    const articulos = await response.json();

    const selectArticulo = newRow.querySelector('select');
    articulos.forEach(articulo => {
        const option = document.createElement('option');
        option.value = articulo.id_articulo;
        option.innerText = articulo.nombre_articulo;
        selectArticulo.appendChild(option);
    });

    newRow.querySelector('.remove-articulo-dar-ropa-de-baja').addEventListener('click', function() {
        newRow.remove();
        rowIdDarRopaDeBaja--;
        updateRowNumbersDarRopaDeBaja();
    });
}

function updateRowNumbersDarRopaDeBaja() {
    const rows = document.querySelectorAll('#dar_ropa_de_baja_container > div');
    rows.forEach((row, index) => {
        row.querySelector('.row-number').innerText = index + 1;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const dar_ropa_de_baja_form = document.getElementById('dar_ropa_de_baja_form');
    dar_ropa_de_baja_form.addEventListener('submit', function (e) {
        e.preventDefault();
        const articulosData = [];
        const filas = document.querySelectorAll('#dar_ropa_de_baja_container > div');
    
        filas.forEach((fila, index) => {
            const select = fila.querySelector('select');
            const input = fila.querySelector('input');
            if (select.value && input.value) {
                articulosData.push({
                    id: index + 1,
                    articuloId: select.value,
                    cantidad: input.value
                });
            }
        });

        let data = {
            rut_usuario_1: dar_ropa_de_baja_form.querySelector("input[name='rut_usuario_1']").value,
            tipo_dada_de_baja: dar_ropa_de_baja_form.querySelector("select[name='tipo_dada_de_baja']").value,
            id_unidad_sigcom: dar_ropa_de_baja_form.querySelector("select[name='unidad_sigcom']").value,
            observaciones: dar_ropa_de_baja_form.querySelector("textarea[name='observaciones']").value,
            articulos: articulosData
        }

        if (articulosData.length !== 0) {
            alert(JSON.stringify(data));
        }
    });
    
    
    const modal = document.querySelector('#dar_ropa_de_baja_modal');
    const closeModal = document.querySelector('#closeModalDarRopaDeBaja');
    
    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        dar_ropa_de_baja_form.querySelector("textarea[name='observaciones']").value = '';
        modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Duration should match the CSS transition duration
        // clear all articles
        const container = document.getElementById('dar_ropa_de_baja_container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        rowIdEntregaUnidadSigcom = 0;
    });
})

document.addEventListener('DOMContentLoaded', function () {
    const tipoDadaDeBajaSelect = document.getElementById('tipo_dada_de_baja');
    const UnidadSigcomSelect = document.getElementById('unidad_sigcom_db');

    function toggleUnidadSigcomSelectDarRopaDeBaja() {
        if (tipoDadaDeBajaSelect.value === '2') {
            UnidadSigcomSelect.disabled = true;
            UnidadSigcomSelect.value = '';
            UnidadSigcomSelect.classList.add('bg-gray-200', 'cursor-not-allowed');
        } else {
            UnidadSigcomSelect.disabled = false;
            UnidadSigcomSelect.classList.remove('bg-gray-200', 'cursor-not-allowed');
        }
    }

    tipoDadaDeBajaSelect.addEventListener('change', toggleUnidadSigcomSelectDarRopaDeBaja);

    // Initial check
    toggleUnidadSigcomSelectDarRopaDeBaja();
});