// ClientProduct.js (Componente React para mostrar productos)
import React, { useState, useEffect } from 'react';

const ClientProduct = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);

    // Cargar productos desde la base de datos
    useEffect(() => {
        fetch('/api/productos')
            .then(response => response.json())
            .then(data => setProductos(data));
    }, []);

    // Función para agregar producto al carrito
    const agregarAlCarrito = (producto) => {
        setCarrito([...carrito, producto]);
    };

    // Función para realizar el pedido
    const realizarPedido = async () => {
        const cliente = { correo: 'cliente@correo.com' };  // Para clientes no registrados, solo con correo.
        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cliente, productos: carrito })
        });
        const data = await response.json();
        alert('Pedido realizado con éxito');
    };

    return (
        <div className="cliente-panel">
            <h2>Catálogo de Productos</h2>
            <div className="productos-list">
                {productos.map((producto) => (
                    <div key={producto.id_producto} className="producto-card">
                        <img src={producto.imagen_url} alt={producto.nombre} />
                        <h4>{producto.nombre}</h4>
                        <p>{producto.descripcion}</p>
                        <p>${producto.precio}</p>
                        <button onClick={() => agregarAlCarrito(producto)}>Agregar al Carrito</button>
                    </div>
                ))}
            </div>
            <button onClick={realizarPedido}>Realizar Pedido</button>
        </div>
    );
};

export default ClientProduct;
