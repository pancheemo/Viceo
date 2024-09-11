// Evento de clic en los enlaces principales

document.getElementById('platforms-link').addEventListener('click', function() {
    alert('¡Explora las plataformas de videojuegos!');
});

document.getElementById('calculator-link').addEventListener('click', function() {
    alert('¡Calcula el costo de tus juegos favoritos!');
});

// Evento de clic en los enlaces del pie de página
document.getElementById('twitter-link').addEventListener('click', function() {
    alert('¡Síguenos en Twitter!');
});

document.getElementById('facebook-link').addEventListener('click', function() {
    alert('¡Síguenos en Facebook!');

});

let scrollPosition = 0;
const scrollAmount = 300;

//mover los productos hacia la derecha
document.getElementById('moverDerecha').addEventListener('click', function() {
    const container = document.querySelector('.producto-container');
    scrollPosition -= scrollAmount;
    container.style.transform = `translateX(${scrollPosition}px)`;
});

//mover los productos hacia la izquierda
document.getElementById('moverIzquierda').addEventListener('click', function() {
    const container = document.querySelector('.producto-container');
    scrollPosition += scrollAmount;
    container.style.transform = `translateX(${scrollPosition}px)`;
});

