// Obtener el carrito desde localStorage
function obtenerCarrito() {
    let carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
}

// Guardar el carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agregar un producto al carrito
function agregarAlCarrito(nombre, precio) {
    let carrito = obtenerCarrito();
    let productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
        // Si el producto ya está en el carrito, aumentar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si no, agregar el nuevo producto con cantidad 1
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }

    guardarCarrito(carrito);
    mostrarCarrito();
    mostrarMensaje(`${nombre} fue añadido al carrito.`);
}

// Mostrar el carrito en la página
function mostrarCarrito() {
    let carrito = obtenerCarrito();
    let carritoElement = document.getElementById('carrito');
    let totalElement = document.getElementById('total');
    carritoElement.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        carritoElement.innerHTML = '<li class="list-group-item">El carrito está vacío.</li>';
        totalElement.textContent = '$0.00';
        return;
    }

    carrito.forEach((producto, index) => {
        let li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${producto.nombre} - $${(producto.precio * producto.cantidad).toFixed(2)} (x${producto.cantidad})`;
        carritoElement.appendChild(li);
        total += producto.precio * producto.cantidad;
    });

    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Vaciar el carrito
function vaciarCarrito() {
    localStorage.removeItem('carrito');
    mostrarCarrito();
    mostrarMensaje('El carrito ha sido vaciado.');
}

// Mostrar mensajes al usuario
function mostrarMensaje(mensaje) {
    let mensajeElement = document.getElementById('mensaje');
    mensajeElement.textContent = mensaje;
    mensajeElement.classList.add('alert', 'alert-success');

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        mensajeElement.textContent = '';
        mensajeElement.classList.remove('alert', 'alert-success');
    }, 3000);
}

// Mostrar el carrito al cargar la página
window.onload = mostrarCarrito;
