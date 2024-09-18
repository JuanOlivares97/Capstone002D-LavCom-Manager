function openEntregarServiciosModal() {
    const modal = document.querySelector('#entregar_ropa_servicios_modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 100);
}

let rowIdEntregaServicios = 0;
async function addArticuloEntregarServicios() {
    rowIdEntregaServicios++;
    const newRow = document.createElement('div');
    newRow.className = 'flex items-center space-x-2 mt-2';
    newRow.innerHTML = `
      <span class="text-sm font-semibold row-number">${rowIdEntregaServicios}</span>
      <select class="flex-grow p-2 border rounded" name="articulo_${rowIdEntregaServicios}" required>
        <option value="">Seleccionar artículo</option>
        <!-- Agregar opciones dinámicamente desde el servidor -->
      </select>
      <input type="number" name="cantidad_${rowIdEntregaServicios}" class="w-28 p-2 border rounded" placeholder="Cantidad" required>
      <button type="button" class="bg-red-500 text-white p-2 rounded hover:bg-red-700 remove-articulo-entregar-servicio">Remove</button>
    `;
    document.getElementById('entregar_ropa_servicios_container').appendChild(newRow);

    const response = await fetch('/clothes/get-clothes');
    const articulos = await response.json();

    const selectArticulo = newRow.querySelector('select');
    articulos.forEach(articulo => {
        const option = document.createElement('option');
        option.value = articulo.id_articulo;
        option.innerText = articulo.nombre_articulo;
        selectArticulo.appendChild(option);
    });

    newRow.querySelector('.remove-articulo-entregar-servicio').addEventListener('click', function() {
        newRow.remove();
        rowIdEntregaServicios--;
        updateRowNumbersEntregarServicios();
    });
}

function updateRowNumbersEntregarServicios() {
    const rows = document.querySelectorAll('#entregar_ropa_servicios_container > div');
    rows.forEach((row, index) => {
        row.querySelector('.row-number').innerText = index + 1;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('entregar_ropa_servicios_form').addEventListener('submit', function (e) {
        e.preventDefault();
        const articulosData = [];
        const filas = document.querySelectorAll('#entregar_ropa_servicios_container > div');
    
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
            rut_usuario_1: document.querySelector("input[name='rut_usuario_1']").value,
            rut_usuario_2: document.querySelector("select[name='rut_usuario_2']").value,
            servicio: document.querySelector("select[name='servicio']").value,
            articulos: articulosData
        }

        if (articulosData.length !== 0) {
            alert(JSON.stringify(data));
        }
    });
    
    
    const modal = document.querySelector('#entregar_ropa_servicios_modal');
    const closeModal = document.querySelector('#closeModalEntregarRopaServicios');
    
    closeModal.addEventListener('click', () => {
        modal.classList.add('opacity-0');
        modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Duration should match the CSS transition duration
        // clear all articles
        const container = document.getElementById('entregar_ropa_servicios_container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        rowIdEntregaServicios = 0;
    });
})

