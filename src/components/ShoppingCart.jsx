import React, { useState } from 'react'
import './ShoppingCart.css'

const initialProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    image: '🎧',
    description: 'Premium noise-cancelling headphones',
    quantity: 1
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 249.99,
    image: '⌚',
    description: 'Fitness tracking and notifications',
    quantity: 1
  },
  {
    id: 3,
    name: 'Laptop Stand',
    price: 49.99,
    image: '💻',
    description: 'Ergonomic adjustable stand',
    quantity: 1
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: '⌨️',
    description: 'RGB backlit mechanical switches',
    quantity: 1
  }
]

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([])
  const [products] = useState(initialProducts)

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <div className="shopping-cart-container">
      <div className="products-section">
        <h2>Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.image}</div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <button
                    className="btn-add-to-cart"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-section">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          {cartItems.length > 0 && (
            <button className="btn-clear" onClick={clearCart}>
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-cart-icon">🛒</div>
            <p>Your cart is empty</p>
            <span>Add some products to get started!</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">{item.image}</div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button
                        className="btn-quantity"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="btn-quantity"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Items ({getTotalItems()})</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>${getTotalPrice() > 100 ? '0.00' : '10.00'}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${(getTotalPrice() + (getTotalPrice() > 100 ? 0 : 10)).toFixed(2)}</span>
              </div>
              <button className="btn-checkout">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ShoppingCart
