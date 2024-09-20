// Función para obtener las tasas de cambio en tiempo real de un webservice público
async function obtenerTasasDeCambio() {
    const url = 'https://api.exchangerate-api.com/v4/latest/USD'; // API de ejemplo
    const response = await fetch(url);
    const datos = await response.json();
    return datos.rates; // Devuelve las tasas de cambio
}

// Llenar los selectores de monedas con los datos de la API
async function llenarSelectoresDeMoneda() {
    const tasas = await obtenerTasasDeCambio();
    const monedas = Object.keys(tasas);
    const monedaOrigenSelect = document.getElementById('monedaOrigen');
    const monedaDestinoSelect = document.getElementById('monedaDestino');

    monedas.forEach(moneda => {
        let optionOrigen = document.createElement('option');
        optionOrigen.value = moneda;
        optionOrigen.text = moneda;
        monedaOrigenSelect.add(optionOrigen);
    });
}

// Función para aplicar impuestos al convertir dólares a pesos argentinos
function aplicarImpuestos(precioEnPesos, impuestos) {
    impuestos.forEach(impuesto => {
        precioEnPesos *= (1 + impuesto / 100);
    });
    return precioEnPesos;
}

// Función para convertir la moneda con o sin impuestos
async function convertir() {
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingrese una cantidad válida.");
        return;
    }

    const monedaOrigen = document.getElementById('monedaOrigen').value;
    const monedaDestino = 'ARS'; // Fijamos Pesos Argentinos como destino
    const tasas = await obtenerTasasDeCambio();
    const tasaOrigen = tasas[monedaOrigen];
    const tasaDestino = tasas[monedaDestino] || 1; // Si es ARS, usamos tasa de 1

    // Calcular conversión inicial
    let resultado = (cantidad / tasaOrigen) * tasaDestino;

    // Verificar si el usuario quiere aplicar impuestos
    const aplicarImpuestosSeleccionado = document.getElementById('aplicarImpuestos').value;
    if (aplicarImpuestosSeleccionado === 'si') {
        // Impuestos en Argentina (30% PAIS, 100% ganancias, 25% bienes personales)
        const impuestos = [30, 100, 25];
        resultado = aplicarImpuestos(resultado, impuestos);
    }

    // Formatear el resultado
    document.getElementById('resultado').textContent = formatearMoneda(resultado, monedaDestino);

    // Guardar en el historial
    guardarEnHistorial(cantidad, monedaOrigen, monedaDestino, resultado, aplicarImpuestosSeleccionado);
}

// Función para formatear monedas
function formatearMoneda(cantidad, moneda) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: moneda }).format(cantidad);
}

// Guardar historial de conversiones en localStorage
function guardarEnHistorial(cantidad, monedaOrigen, monedaDestino, resultado, aplicarImpuestos) {
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    const nuevaOperacion = {
        id: historial.length + 1,
        cantidad,
        monedaOrigen,
        monedaDestino,
        resultado,
        aplicarImpuestos: aplicarImpuestos === 'si' ? 'Con impuestos' : 'Sin impuestos',
        fecha: new Date().toLocaleString(),
        tasa: (resultado / cantidad).toFixed(4)
    };
    historial.push(nuevaOperacion);
    localStorage.setItem('historial', JSON.stringify(historial));
    mostrarHistorial();
}

// Mostrar el historial de conversiones
function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    const historialElement = document.getElementById('historial');
    historialElement.innerHTML = '';

    historial.forEach(operacion => {
        let li = document.createElement('li');
        li.textContent = `ID: ${operacion.id} | ${operacion.cantidad} ${operacion.monedaOrigen} a ${operacion.monedaDestino} = ${formatearMoneda(operacion.resultado, operacion.monedaDestino)} (Tasa: ${operacion.tasa}) - ${operacion.aplicarImpuestos} - Fecha: ${operacion.fecha}`;
        historialElement.appendChild(li);
    });
}

// Función para borrar el historial
function borrarHistorial() {
    localStorage.removeItem('historial');
    mostrarHistorial(); // Refrescar la vista del historial
    alert("Historial de conversiones eliminado.");
}

// Validar el CBU/Swift
function validarCBU(cbu) {
    const regexCBU = /^\d{22}$/; // Un CBU típico tiene 22 dígitos
    return regexCBU.test(cbu);
}

// Simular compra de moneda
function comprarMoneda() {
    const cbu = document.getElementById('cbu').value;
    if (!validarCBU(cbu)) {
        alert("Por favor, ingrese un CBU/Swift válido.");
        return;
    }

    const mensajeCompra = document.getElementById('mensajeCompra');
    mensajeCompra.textContent = `Compra exitosa. Se ha transferido la moneda a su cuenta (CBU: ${cbu}). Gracias por usar nuestro servicio.`;
    mensajeCompra.classList.add('alert', 'alert-success');

    // Limpiar campos
    document.getElementById('cantidad').value = '';
    document.getElementById('cbu').value = '';

    setTimeout(() => {
        mensajeCompra.textContent = '';
        mensajeCompra.classList.remove('alert', 'alert-success');
    }, 5000);
}

// Asociar eventos a los botones
document.getElementById('convertirBtn').addEventListener('click', convertir);
document.getElementById('comprarBtn').addEventListener('click', comprarMoneda);
document.getElementById('borrarHistorialBtn').addEventListener('click', borrarHistorial);

// Cargar monedas y mostrar historial al inicio
llenarSelectoresDeMoneda();
mostrarHistorial();
