document.addEventListener('DOMContentLoaded', () => {
    const toggleSidebarButton = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');

    toggleSidebarButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    const toggleSidebarMobileButton = document.getElementById('toggleSidebarMobile');
    const sidebarMobile = document.getElementById('menuMobile');
    const closeMenuMobile = document.getElementById('closeMenuMobile');
    
    toggleSidebarMobileButton.addEventListener('click', () => {
        sidebarMobile.classList.remove('hidden');
        sidebarMobile.classList.add('block');
    });
    closeMenuMobile.addEventListener('click',() => {
        sidebarMobile.classList.remove('block');
        sidebarMobile.classList.add('hidden');
    });


});
