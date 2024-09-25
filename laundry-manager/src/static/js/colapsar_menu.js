
        // Seleccionamos el botón y el sidebar
        const toggleButton = document.getElementById('toggleSidebar');
        const sidebar = document.getElementById('sidebar');
        const menuItems = document.querySelectorAll('#menu li span'); // Para ocultar los textos

        // Añadimos el evento de clic para alternar la clase
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Ajustamos la visibilidad de los textos
            if (sidebar.classList.contains('collapsed')) {
                menuItems.forEach(item => item.style.display = 'none');
            } else {
                menuItems.forEach(item => item.style.display = 'inline');
            }
        });
