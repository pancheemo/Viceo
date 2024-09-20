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
        productoExistente.cantidad += 1;
    } else {
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
        document.getElementById('comprar-btn').style.display = 'none'; // Ocultar botón comprar si el carrito está vacío
        return;
    }

    carrito.forEach((producto, index) => {
        let li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            ${producto.nombre} - $${(producto.precio * producto.cantidad).toFixed(2)} (x${producto.cantidad})
            <button class="btn btn-danger btn-sm float-right" onclick="eliminarProducto(${index})">Eliminar</button>
        `;
        carritoElement.appendChild(li);
        total += producto.precio * producto.cantidad;
    });

    totalElement.textContent = `$${total.toFixed(2)}`;
    document.getElementById('comprar-btn').style.display = 'block'; // Mostrar botón comprar si hay productos
}

// Eliminar un producto específico del carrito
function eliminarProducto(index) {
    let carrito = obtenerCarrito();
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    mostrarCarrito();
    mostrarMensaje('Producto eliminado del carrito.');
}

// Vaciar el carrito completamente
function vaciarCarrito() {
    localStorage.removeItem('carrito');
    mostrarCarrito();
    mostrarMensaje('El carrito ha sido vaciado.');
}

// Finalizar compra
function finalizarCompra() {
    let totalElement = document.getElementById('total').textContent;
    mostrarMensaje(`Gracias por tu compra. El total es ${totalElement}.`);
    localStorage.removeItem('carrito');
    mostrarCarrito();

    // Simulación de formulario de pago
    document.getElementById('formulario-pago').style.display = 'block';
}

// Mostrar mensajes al usuario
function mostrarMensaje(mensaje) {
    let mensajeElement = document.getElementById('mensaje');
    mensajeElement.textContent = mensaje;
    mensajeElement.classList.add('alert', 'alert-success');

    setTimeout(() => {
        mensajeElement.textContent = '';
        mensajeElement.classList.remove('alert', 'alert-success');
    }, 3000);
}

// Mostrar el carrito al cargar la página
window.onload = mostrarCarrito;
