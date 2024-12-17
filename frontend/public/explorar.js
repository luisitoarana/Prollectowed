document.addEventListener("DOMContentLoaded", () => {
    loadProducts(); // Llamada para cargar productos al cargar la página
});

async function loadProducts() {
    try {
        const response = await fetch("http://localhost:3000/productos"); // Llama al servidor
        if (!response.ok) throw new Error("Error al cargar productos.");
        
        const products = await response.json(); // Obtiene los productos en formato JSON
        const productsContainer = document.getElementById('productsContainer'); // Asegúrate de que el contenedor sea el correcto
        productsContainer.innerHTML = ""; // Limpia el contenedor antes de agregar productos
        
        products.forEach(product => addProductToDOM(product)); // Agrega cada producto al DOM
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function addProductToDOM(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.dataset.id = product.id;

    // Buscar imagen por nombre de producto (convertido a minúsculas y sin espacios)
    const productImage = getProductImage(product.nombre);

    productCard.innerHTML = `
        <img src="${productImage}" alt="${product.nombre}" class="product-image">
        <h3>${product.nombre}</h3>
        <p class="price">$${product.precio}</p>
        <p class="stock">Stock: ${product.stock}</p>
        <button class="buy-btn" onclick="buyProduct(${product.id}, ${product.stock})">Comprar</button>
    `;

    const productsContainer = document.getElementById('productsContainer');
    productsContainer.appendChild(productCard); // Agrega la tarjeta al contenedor
}

function getProductImage(productName) {
    // Convertir el nombre del producto a minúsculas y reemplazar espacios por guiones bajos
    const formattedName = productName.toLowerCase().replace(/\s+/g, '_');
    
    // Ruta a la carpeta pública donde están las imágenes
    const imagePath = `${formattedName}.png`; //`${formattedName}.png` el por defecto

    // Verificar si la imagen existe (esto depende de tu servidor o sistema)
    const defaultImage = 'miel.png'; // Imagen por defecto si no se encuentra la imagen específica
    const image = new Image();
    image.src = imagePath;

    // Devuelve la ruta por defecto mientras carga la imagen
    image.onload = function () {
        return imagePath; // Si la imagen existe, devolver la ruta
    };
    image.onerror = function () {
        return defaultImage; // Si la imagen no existe, devolver la imagen por defecto
    };

    return defaultImage; // Valor inicial (en caso de error antes de cargar la imagen)
}

function buyProduct(productId, stock) {
    // Muestra el modal para comprar
    const modal = document.getElementById('modal');
    const productNameModal = document.getElementById('product-name-modal');
    const productQuantityInput = document.getElementById('product-quantity');
    
    // Setea el nombre del producto en el modal
    const productName = document.querySelector(`.product-card[data-id="${productId}"] h3`).innerText;
    productNameModal.innerText = productName;

    // Establece el stock máximo en el input de cantidad
    productQuantityInput.max = stock;
    productQuantityInput.value = 1;

    // Muestra el modal
    modal.classList.remove('hidden');

    // Función para confirmar la compra
    document.getElementById('confirm-purchase').onclick = () => {
        const quantity = productQuantityInput.value;
        if (quantity > 0 && quantity <= stock) {
            alert(`Compraste ${quantity} ${productName}(s).`);
            modal.classList.add('hidden'); // Cierra el modal después de la compra
        } else {
            alert("Cantidad inválida.");
        }
    };

    // Función para cancelar la compra
    document.getElementById('cancel-purchase').onclick = () => {
        modal.classList.add('hidden'); // Cierra el modal si el usuario cancela
    };
}
