sessionStorage.id || localStorage.id 
    ? renderHomePage() // Si hay un ID almacenado en sessionStorage o localStorage, mostramos la página de inicio
    : renderLanding(); // Si no hay un ID, mostramos la página de inicio de sesión o registro (landing)
