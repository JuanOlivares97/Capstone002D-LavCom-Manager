function openEntregarServiciosModal() {
    const modal = document.querySelector('#entregar_ropa_servicios_modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 100);
}

let rowId = 0;
async function addArticulo() {
    rowId++;
    const newRow = document.createElement('div');
    newRow.className = 'flex items-center space-x-2 mt-2';
    newRow.innerHTML = `
      <span class="text-sm font-semibold">${rowId}</span>
      <select class="flex-grow p-2 border rounded" name="articulo_${rowId}" required>
        <option value="">Seleccionar artículo</option>
        <!-- Agregar opciones dinámicamente desde el servidor -->
      </select>
      <input type="number" name="cantidad_${rowId}" class="w-28 p-2 border rounded" placeholder="Cantidad" required>
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

        if (articulosData.length !== 0) {
            alert(JSON.stringify(articulosData));
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
        rowId = 0;
    });
})

