let carrito = JSON.parse(localStorage.getItem('carrito')) || []; 
let productos = [];

document.getElementById("filtroInput").addEventListener("input", filtrarProductos);

function obtenerInfoProductos(){
    return new Promise((resolve,reject) => {
        fetch('../json/productos.json')
            .then(response => {
                if(!response.ok){
                    throw new Error ("Error al cargar la API, comunicate con tu administrador.")
                }
                return response.json();
            })
            .then(data => resolve(data))
            .catch(error => reject(error))
            .finally(() => {
                console.log("Operación completada, independientemente del resultado");
            });
    });
}

async function main (){
    try{
        const informacionProductos = await obtenerInfoProductos()
        productos = informacionProductos;
        mostrarProductos(productos);
    }catch(error){
        console.log("Error en la app", error)
    }
}
main()

function guardarCarritoLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(index) {
    Toastify({
        text: "Producto agregado al carrito",
        className: "info",
        gravity: "bottom",
        style: {
        background: "#9daf89",
        color:"#000"
        }
    }).showToast();
    
    if (index >= 0 && index < productos.length) {
        const productoExistente = carrito.find(item => item.nombre === productos[index].nombre);
        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            const { nombre, precio, descripcion } = productos[index];
            carrito.push({
                nombre,
                precio,
                descripcion,
                cantidad: 1
            });       
        }
        guardarCarritoLocalStorage();
        actualizarListaCarrito();
        actualizarContadorCarrito();  
    }
}

actualizarContadorCarrito();

function actualizarContadorCarrito() {
    const contadorElement = document.getElementById('contadorAgregados');
    contadorElement.textContent = carrito.length.toString();
    const botonVaciarCarrito = document.getElementById('botonVaciarCarrito');
    botonVaciarCarrito.disabled = carrito.length === 0;
    const botonFinalizarCompra = document.getElementById('botonFinalizarCompra');
    botonFinalizarCompra.disabled = carrito.length === 0
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

function finalizarCompra(){
    Toastify({
        text: "Su compra se realizó con éxito!",
        className: "info",
        gravity: "bottom",
        position: "left",
        style: {
        background: "#7fff00",
        color:"#000"
        }
    }).showToast();

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
        item.innerHTML = `${producto.nombre} - Precio: $${producto.precio}<button class="botonCantidad" onclick="restarCantidad('${producto.nombre}')">--</button>${producto.cantidad}
        <button class="botonCantidad" onclick="sumarCantidad('${producto.nombre}')">+</button> - Total: $${precioTotal}
        <span class="fas fa-trash-alt float-right" style="cursor: pointer;" onclick="eliminarDelCarrito(${index})"></span>`;
        listaCarrito.appendChild(item);
    });

    document.getElementById("totalImportes").textContent = "Total General: $" + totalGeneral;
}

function restarCantidad(nombreProducto) {
    const productoExistente = carrito.find(item => item.nombre === nombreProducto);
        if (productoExistente && productoExistente.cantidad > 1) {
            productoExistente.cantidad --;
        }
        guardarCarritoLocalStorage();
        actualizarListaCarrito(); 
}

function sumarCantidad(nombreProducto) {
    const productoExistente = carrito.find(item => item.nombre === nombreProducto);
        if (productoExistente) {
            productoExistente.cantidad ++;
        }
        guardarCarritoLocalStorage();
        actualizarListaCarrito(); 
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1); 
    actualizarListaCarrito();
    actualizarContadorCarrito();
    guardarCarritoLocalStorage();
}

function vaciarCarrito() {
    Toastify({
        text: "Vaciaste el carrito",
        className: "info",
        gravity: "top",
        style: {
        background: "#ff6347",
        color:"#000"
        }
    }).showToast();
    carrito = [];
    localStorage.clear();
    document.getElementById('botonVaciarCarrito').disabled = true;
    actualizarListaCarrito();
    actualizarContadorCarrito();
}

// Función para mostrar productos en el contenedor
function mostrarProductos(productosFiltrados) {
    const productosContainer = document.getElementById("productosContainer");
    productosContainer.innerHTML = ""; // Limpio el contenedor antes de mostrar los productos

    productosFiltrados.map((producto) => {
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

