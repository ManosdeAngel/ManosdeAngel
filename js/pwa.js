let deferredPrompt;

// 1. Registrar el Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado: ', reg))
            .catch(err => console.log('Error al registrar SW: ', err));
    });
}

// 2. Escuchar evento de instalación disponible
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Buscar el botón en el HTML y mostrarlo
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
        installBtn.classList.remove('d-none'); // Mostrar botón
        
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Usuario decidió: ${outcome}`);
            deferredPrompt = null;
            installBtn.classList.add('d-none'); // Ocultar tras instalar
        });
    }
});

// 3. Confirmación de instalación
window.addEventListener('appinstalled', () => {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) installBtn.classList.add('d-none');
    console.log('Aplicación instalada correctamente');
});