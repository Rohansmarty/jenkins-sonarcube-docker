# jenkins-sonarcube-docker

## Shopping Cart UI

A modern, responsive shopping cart UI implementation built with React and Vite.

### Features
   
- 🛒 Add products to cart
- ➕➖ Update item quantities
- 🗑️ Remove items from cart
- 💰 Real-time price calculations
- 🚚 Free shipping for orders over $100
- 📱 Fully responsive design
- 🎨 Modern, beautiful UI with smooth animations

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Project Structure

```
├── src/
│   ├── components/
│   │   ├── ShoppingCart.jsx    # Main shopping cart component
│   │   └── ShoppingCart.css    # Shopping cart styles
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # App styles
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html                  # HTML entry point
├── package.json                # Dependencies
└── vite.config.js             # Vite configuration
```

### Technologies Used

- React 18
- Vite
- CSS3 (with modern features like gradients and flexbox)
