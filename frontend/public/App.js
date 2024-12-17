// src/App.js
import React from 'react';
import './App.css';
import ClientProduct from './components/ClientProduct';

function App() {
  return (
    <div className="App">
      <h1>Bienvenido a la Tienda</h1>
      <ClientProduct />
    </div>
  );
}

export default App;
