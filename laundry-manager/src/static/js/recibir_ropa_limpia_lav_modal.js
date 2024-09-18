function openRecibirRopaLimpiaLavModal() {
    const modal = document.querySelector('#recibir_ropa_limpia_lav_modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 100);
}

let rowIdRecibirLav = 0;
async function addArticuloRecibirRopaLimpiaLav() {
    rowIdRecibirLav++;
    const newRow = document.createElement('div');
    newRow.className = 'flex items-center space-x-2 mt-2';
    newRow.innerHTML = `
      <span class="text-sm font-semibold row-number">${rowIdRecibirLav}</span>
      <select class="flex-grow p-2 border rounded" name="articulo_${rowIdRecibirLav}" required>
        <option value="">Seleccionar artículo</option>
        <!-- Agregar opciones dinámicamente desde el servidor -->
      </select>
      <input type="number" name="cantidad_${rowIdRecibirLav}" class="w-28 p-2 border rounded" placeholder="Cantidad" required>
      <button type="button" class="bg-red-500 text-white p-2 rounded hover:bg-red-700 remove-articulo-recibir-lavanderia">Remove</button>
    `;
    document.getElementById('recibir_ropa_limpia_lav_container').appendChild(newRow);

    const response = await fetch('/clothes/get-clothes');
    const articulos = await response.json();

    const selectArticulo = newRow.querySelector('select');
    articulos.forEach(articulo => {
        const option = document.createElement('option');
        option.value = articulo.id_articulo;
        option.innerText = articulo.nombre_articulo;
        selectArticulo.appendChild(option);
    });

    newRow.querySelector('.remove-articulo-recibir-lavanderia').addEventListener('click', function() {
        newRow.remove();
        rowIdRecibirLav--;
        updateRowNumbers();
    });
}

function updateRowNumbersRecibirLav() {
    const rows = document.querySelectorAll('#recibir_ropa_limpia_lav_container > div');
    rows.forEach((row, index) => {
        row.querySelector('.row-number').innerText = index + 1;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const form_recibir_ropa_limpia_lav = document.getElementById('recibir_ropa_limpia_lav_form');
    form_recibir_ropa_limpia_lav.addEventListener('submit', function (e) {
        e.preventDefault();
        const articulosData = [];
        const filas = document.querySelectorAll('#recibir_ropa_limpia_lav_container > div');
    
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
            rut_usuario_1: form_recibir_ropa_limpia_lav.querySelector("input[name='rut_usuario_1']").value,
            articulos: articulosData
        }

        if (articulosData.length !== 0) {
            alert(JSON.stringify(data));
        }
    });
    
    
    const modal = document.querySelector('#recibir_ropa_limpia_lav_modal');
    const closeModal = document.querySelector('#closeModalRecibirLav');
    
    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Duration should match the CSS transition duration
        // clear all articles
        const container = document.getElementById('recibir_ropa_limpia_lav_container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        rowIdRecibirLav = 0;
    });
})

