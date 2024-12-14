document.addEventListener('DOMContentLoaded', function () {
    // Función que hace el select buscable
    function makeSelectSearchable(selectElement) {
        // Crear el campo de búsqueda
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.classList.add('w-full', 'p-2', 'border', 'rounded', 'mb-2', 'bg-gray-200');
        searchInput.placeholder = 'Buscar...';

        // Crear una lista de opciones para el select
        const optionsList = document.createElement('ul');
        optionsList.classList.add('absolute', 'w-full', 'border', 'bg-white', 'rounded', 'max-h-60', 'overflow-y-auto', 'mt-1', 'hidden');
        optionsList.style.zIndex = 9999;

        // Crear las opciones de la lista basada en las opciones del select original
        const options = Array.from(selectElement.options);
        options.forEach(option => {
            const listItem = document.createElement('li');
            listItem.textContent = option.textContent;
            listItem.setAttribute('data-value', option.value);
            listItem.classList.add('p-2', 'cursor-pointer', 'hover:bg-gray-200');
            optionsList.appendChild(listItem);
        });

        // Crear un contenedor para el campo de búsqueda y la lista de opciones
        const selectWrapper = document.createElement('div');
        selectWrapper.classList.add('relative');
        
        // Insertar el campo de búsqueda y las opciones en el contenedor
        selectWrapper.appendChild(searchInput);
        selectWrapper.appendChild(optionsList);
        
        // Reemplazar el select original por el nuevo contenedor
        selectElement.parentNode.replaceChild(selectWrapper, selectElement);

        // Asegurarse de que el campo de búsqueda tenga el foco con un pequeño retraso
        setTimeout(function() {
            searchInput.focus(); // Aplica focus después de agregar el input al DOM
        }, 0);

        // Función para filtrar las opciones según el texto ingresado
        searchInput.addEventListener('input', function () {
            const searchTerm = searchInput.value.toLowerCase();
            const items = optionsList.querySelectorAll('li');
            let hasResults = false;

            items.forEach(item => {
                const optionText = item.textContent.toLowerCase();
                if (optionText.includes(searchTerm)) {
                    item.classList.remove('hidden');
                    hasResults = true;
                } else {
                    item.classList.add('hidden');
                }
            });

            // Mostrar u ocultar la lista de opciones dependiendo de si hay resultados
            optionsList.classList.toggle('hidden', !hasResults);
        });

        // Selección de una opción
        optionsList.addEventListener('click', function (e) {
            const selectedOption = e.target;
            if (selectedOption.tagName === 'LI') {
                searchInput.value = selectedOption.textContent; // Mostrar el texto de la opción seleccionada
                selectElement.value = selectedOption.getAttribute('data-value'); // Establecer el valor del select original
                optionsList.classList.add('hidden'); // Ocultar la lista después de seleccionar

                // Restaurar el select original
                restoreSelect(selectElement, selectWrapper, options);
            }
        });

        // Mostrar la lista de opciones cuando el usuario hace clic en el campo de búsqueda
        searchInput.addEventListener('focus', function () {
            optionsList.classList.remove('hidden');
        });

        // Ocultar la lista cuando el usuario hace clic fuera del campo de búsqueda, la lista o el contenedor
        document.addEventListener('click', function (e) {
            if (!selectWrapper.contains(e.target)) {
                optionsList.classList.add('hidden');
                // Restaurar el select original si se hace clic fuera del contenedor
                restoreSelect(selectElement, selectWrapper, options);
            }
        });

        // Prevenir que el clic en el input de búsqueda o en la lista cierre el select
        searchInput.addEventListener('click', function (e) {
            e.stopPropagation(); // Evita que el clic en el input o en las opciones cierre la lista
        });

        optionsList.addEventListener('click', function (e) {
            e.stopPropagation(); // Evita que el clic en las opciones cierre la lista
        });
    }

    // Función para restaurar el select original
    function restoreSelect(selectElement, selectWrapper, options) {
        const restoredSelect = document.createElement('select');
        
        // Copiar los atributos esenciales (id, name, etc.)
        restoredSelect.id = selectElement.id;
        restoredSelect.name = selectElement.name;
        restoredSelect.classList.add(...selectElement.classList); // Mantener las clases del select original

        // Copiar cualquier atributo adicional (como disabled o required)
        if (selectElement.disabled) {
            restoredSelect.disabled = true;
        }
        if (selectElement.required) {
            restoredSelect.required = true;
        }

        // Recrear las opciones del select original
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.textContent;
            restoredSelect.appendChild(optionElement);
        });

        // Establecer el valor seleccionado
        restoredSelect.value = selectElement.value;

        // Reemplazar el contenedor con el select original
        selectWrapper.parentNode.replaceChild(restoredSelect, selectWrapper);

        // Volver a aplicar el comportamiento de búsqueda en el select restaurado
        restoredSelect.addEventListener('click', function (e) {
            e.stopPropagation(); // Evitar que se cierre inmediatamente
            makeSelectSearchable(restoredSelect); // Aplicar de nuevo la funcionalidad de búsqueda
        });
    }

    // Inicializar todos los selects que tengan la clase 'searchable'
    const searchableSelects = document.querySelectorAll('select');
    searchableSelects.forEach(select => {
        select.addEventListener('click', function (e) {
            e.stopPropagation(); // Evitar que se cierre inmediatamente
            makeSelectSearchable(select); // Convertir el select en buscable
        });
    });

    // Uso de MutationObserver para escuchar cambios en el DOM (selects agregados dinámicamente)
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'DIV') {
                    const select = node.querySelector('select');
                    if (select) {
                        select.addEventListener('click', function (e) {
                            e.stopPropagation(); // Evitar que se cierre inmediatamente
                            makeSelectSearchable(select); // Convertir el select en buscable
                        })
                    }
                }
            });
        });
    });
    

    // Configuración del MutationObserver para observar todo el documento
    observer.observe(document.body, { childList: true, subtree: true });
});