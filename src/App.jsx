import React from 'react'
import ShoppingCart from './components/ShoppingCart'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🛒 Shopping Cart</h1>
        <p>Modern e-commerce shopping experience</p>
      </header>
      <main className="app-main">
        <ShoppingCart />
      </main>
    </div>
  )
}

export default App
