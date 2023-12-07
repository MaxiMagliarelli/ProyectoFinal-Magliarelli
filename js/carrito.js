let carrito = JSON.parse(localStorage.getItem('carrito')) || []; 

//Creo mi array de objetos con los distintos productos disponibles.

const productos = [
    {nombre: "Asesoria Express", precio: 100000, descripcion: "Asesoria Express con detalles mínimos, no incluye renders.", img:"./assets/asesoriaexpress.jpg"},
    {nombre: "Asesoria Intermedia", precio: 150000, descripcion: "Asesoria intermedia: incluye plano de distribucion y renders.", img:"./assets/asesoriaintermedia.jpg"},
    {nombre: "Asesoria Integral", precio: 250000, descripcion: "Asesoria integral con detalles y renders, presupuesto y guia de compras.", img:"./assets/asesoriaintegral.jpg"},
    {nombre: "Curso de SketchUP", precio: 50000, descripcion: "Curso de SketchUp para diseño y proyección de interiores.", img: "./assets/cursosketchok.jpg"},
    {nombre: "Ebook de estilos", precio: 10000, descripcion: "Guia completa de los distintos estilos del interiorismo.", img: "./assets/ebook.jpg"},
    {nombre: "Ebook sobre cocinas", precio: 25000, descripcion: "Todo lo que tenes que saber sobre las refacciones de cocinas.", img:"./assets/ebookcocinas.jpg"},
];

function guardarCarritoLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(index) {
    if (index >= 0 && index < productos.length) {
        const productoExistente = carrito.find(item => item.nombre === productos[index].nombre);
        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({
                nombre: productos[index].nombre,
                precio: productos[index].precio,
                descripcion: productos[index].descripcion,
                cantidad: 1
            });
        }
        guardarCarritoLocalStorage();
        actualizarListaCarrito();
        actualizarContadorCarrito();
        mostrarModal();
        
    }
}

function actualizarContadorCarrito() {
    const contadorElement = document.getElementById('contadorAgregados');
    contadorElement.textContent = carrito.length.toString();
}

function mostrarModal() {
    const modal = document.getElementById('carritoModal');
    modal.style.display = 'block';
    actualizarListaCarrito();
}
function cerrarModal() {                                        
    const modal = document.getElementById('carritoModal');
    modal.style.display = 'none';
}
function actualizarListaCarrito() {
    const listaCarrito = document.getElementById('listaCarrito');
    listaCarrito.innerHTML = '';
    let totalGeneral= 0

    carrito.map((producto, index) => {
        const item = document.createElement('li');
        const precioTotal = producto.precio * producto.cantidad;
        totalGeneral += precioTotal
        item.innerHTML = `${producto.nombre} - Precio: $${producto.precio} - Cantidad: ${producto.cantidad} - Total: $${precioTotal}
        <span class="fas fa-trash-alt float-right" style="cursor: pointer;" onclick="eliminarDelCarrito(${index})"></span>`;
        listaCarrito.appendChild(item);
    });
    // Mostrar el total general
    
    document.getElementById("totalImportes").textContent = "Total General: $" + totalGeneral;
}
function eliminarDelCarrito(index) {
    carrito.splice(index, 1); // Eliminar el elemento del array
    actualizarListaCarrito();
    actualizarContadorCarrito();
    guardarCarritoLocalStorage();
}

// Función para mostrar productos en el contenedor

function mostrarProductos(productosFiltrados) {
    const productosContainer = document.getElementById("productosContainer");
    productosContainer.innerHTML = ""; // Limpiamos el contenedor antes de mostrar los productos

    productosFiltrados.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <img src="${producto.img}" alt="${producto.nombre}">
        <div>
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">Precio: $${producto.precio}</p>
        </div>
        <button onclick="agregarAlCarrito(${productos.indexOf(producto)})">Agregar al carrito</button>`;
        productosContainer.appendChild(card)});
}
    // Función para filtrar los productos
    
    function filtrarProductos() {
    const textoBusqueda = document.getElementById("filtroInput").value.toLowerCase();
    const productosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(textoBusqueda));
    mostrarProductos(productosFiltrados);
}
document.getElementById("filtroInput").addEventListener("input", filtrarProductos);

  // Mostrar todos los productos al cargar la página

    mostrarProductos(productos);
