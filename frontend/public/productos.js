
// FRONTEND - Código para gestionar productos en la interfaz
const form = document.getElementById('add-product-form');
const productsList = document.getElementById('products-list');

// Función para cargar los productos desde la base de datos
async function loadProducts() {
  try {
    const response = await fetch("http://localhost:3000/productos");
    if (response.ok) {
      const products = await response.json();
      productsList.innerHTML = ""; // Limpiar la lista antes de agregar
      products.forEach(product => {
        addProductToDOM(product);
      });
    } else {
      throw new Error("Error al cargar los productos.");
    }
  } catch (error) {
    console.error("Error cargando productos:", error);
    alert("No se pudo cargar los productos.");
  }
}

// Función para agregar un producto
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('product-name').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const type = document.getElementById('product-type').value;
  const stock = parseInt(document.getElementById('product-stock').value, 10);
  const price = parseFloat(document.getElementById('product-price').value);

  if (!name || !description || !type || isNaN(stock) || isNaN(price)) {
    alert("Por favor, complete todos los campos correctamente.");
    return;
  }

  const newProduct = { nombre: name, descripcion: description, tipo: type, stock, precio: price };

  try {
    const response = await fetch("http://localhost:3000/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    });

    if (response.ok) {
      const product = await response.json();
      addProductToDOM(product);
      form.reset();
    } else {
      throw new Error("Error al agregar el producto.");
    }
  } catch (error) {
    console.error("Error agregando producto:", error);
    alert("No se pudo agregar el producto.");
  }
});

// Función para agregar un producto al DOM
function addProductToDOM(product) {
  const productCard = document.createElement('div');
  productCard.classList.add('product-card');
  productCard.dataset.id = product.id;
  productCard.innerHTML = `
    <h3>${product.nombre}</h3>
    <p>${product.descripcion}</p>
    <p class="price">$${product.precio.toFixed(2)}</p>
    <p>Tipo: ${product.tipo}</p>
    <p class="stock">${product.stock} unidades</p>
    <div class="actions">
      <button onclick="editProduct(${product.id})">Editar</button>
      <button onclick="deleteProduct(${product.id})">Eliminar</button>
    </div>
  `;
  productsList.appendChild(productCard);
}

// Función para eliminar un producto
async function deleteProduct(id) {
  try {
    const response = await fetch(`http://localhost:3000/productos/${id}`, {
      method: "DELETE"
    });
    if (response.ok) {
      document.querySelector(`.product-card[data-id='${id}']`).remove();
    } else {
      throw new Error("Error al eliminar el producto.");
    }
  } catch (error) {
    console.error("Error eliminando producto:", error);
    alert("No se pudo eliminar el producto.");
  }
}

// Función para editar un producto
async function editProduct(id) {
  const productCard = document.querySelector(`.product-card[data-id='${id}']`);
  const name = productCard.querySelector('h3').textContent;
  const description = productCard.querySelector('p:nth-of-type(1)').textContent;
  const price = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
  const stock = parseInt(productCard.querySelector('.stock').textContent);
  const type = productCard.querySelector('p:nth-of-type(3)').textContent.replace('Tipo: ', '');

  document.getElementById('product-name').value = name;
  document.getElementById('product-description').value = description;
  document.getElementById('product-price').value = price;
  document.getElementById('product-stock').value = stock;
  document.getElementById('product-type').value = type;

  await deleteProduct(id);
}

// Cargar productos al inicio
loadProducts();