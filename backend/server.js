// BACKEND - Código para gestionar productos en la base de datos
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "12345", // Cambia esto si tienes una contraseña diferente
  database: "tienda"
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos.");
});

// Ruta para obtener productos
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Ruta para agregar un producto
app.post("/productos", (req, res) => {
  const { nombre, descripcion, tipo, stock, precio } = req.body;
  const sql = "INSERT INTO productos (nombre, descripcion, tipo, stock, precio) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [nombre, descripcion, tipo, stock, precio], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id: result.insertId, nombre, descripcion, tipo, stock, precio });
    }
  });
});

// Ruta para actualizar un producto
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, tipo, stock, precio } = req.body;
  const sql = "UPDATE productos SET nombre = ?, descripcion = ?, tipo = ?, stock = ?, precio = ? WHERE id = ?";
  db.query(sql, [nombre, descripcion, tipo, stock, precio, id], (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id, nombre, descripcion, tipo, stock, precio });
    }
  });
});

// Ruta para eliminar un producto
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM productos WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ message: "Producto eliminado", id });
    }
  });
});

// Ruta para actualizar parcialmente (por ejemplo, reducir stock)
app.patch("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  const sql = "UPDATE productos SET stock = ? WHERE id = ?";
  db.query(sql, [stock, id], (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: "Stock actualizado", id, stock });
    }
  });
});


// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});