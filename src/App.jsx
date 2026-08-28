import { useEffect, useMemo, useState } from 'react'
import './App.css'

const categories = [
  { id: 'turkey', label: 'Turkey Specials 🦃' },
  { id: 'poultry', label: 'Other Poultry 🐓' },
  { id: 'feeds', label: 'Livestock Feeds 🌾' },
]

const products = [
  { id: 'turkey-chicks', category: 'turkey', name: 'Turkey Chicks', nameTa: 'டர்கி குஞ்சுகள்', unit: 'Piece', image: 'https://images.unsplash.com/photo-1631391098004-d5a6fb7c383b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'fresh-turkey-flesh', category: 'turkey', name: 'Fresh Turkey Flesh', nameTa: 'புதிய டர்கி இறைச்சி', unit: 'Kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'turkey-eggs', category: 'turkey', name: 'Turkey Eggs', nameTa: 'டர்கி முட்டைகள்', unit: 'Piece', image: 'https://plus.unsplash.com/premium_photo-1671022581639-39edb4a48c6d?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'live-turkey', category: 'turkey', name: 'Live Turkey', nameTa: 'நேரடி டர்கி', unit: 'Piece', image: 'https://images.unsplash.com/photo-1606081165491-3384c9156db9?q=80&w=994&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'turkey-pickle', category: 'turkey', name: 'Turkey Pickle', nameTa: 'டர்கி ஊறுகாய்', unit: 'Jar', image: 'https://foodonfarmpickles.com/cdn/shop/files/Chickenpickle_with_bone.webp?crop=center&height=800&v=1778395771&width=800', featured: true, newArrival: true },
  { id: 'country-chicken', category: 'poultry', name: 'Country Chicken', nameTa: 'நாட்டுக் கோழி', unit: 'Kg', image: 'https://terralingua.org/wp-content/uploads/2021/07/Langscape-Magazine_Siripurapu_FEATURE3.jpg' },
  { id: 'sonali-chicken', category: 'poultry', name: 'Sonali Chicken', nameTa: 'சோனாலி கோழி', unit: 'Kg / Piece', image: 'https://cpimg.tistatic.com/11504924/b/4/Sonali-Breed-Chicken..jpg' },
  { id: 'ginni', category: 'poultry', name: 'Ginni (Guineafowl)', nameTa: 'கின்னி (கினியா கோழி)', unit: 'Piece', image: 'https://5.imimg.com/data5/ANDROID/Default/2023/6/318472686/ZD/CV/BU/21290659/product-jpeg-500x500.jpg' },
  { id: 'poultry-feed', category: 'feeds', name: 'Poultry Feed', nameTa: 'பண்ணை தீவனம்', unit: 'Bag/Sack', image: 'https://5.imimg.com/data5/AQ/SQ/VP/ANDROID-69802736/product-jpeg.jpg' },
  { id: 'cattle-feed', category: 'feeds', name: 'Cattle Feed', nameTa: 'கால்நடை தீவனம்', unit: 'Bag/Sack', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHQQm0fKRCCunmUgaphzSH-Ppgybuoi12GDmqTzVqxQWapzcHvQGI_Oy-v&s=10' },
  { id: 'rabbit-feed', category: 'feeds', name: 'Rabbit Feed', nameTa: 'முயல் தீவனம்', unit: 'Bag/Sack', image: 'https://content.jdmagicbox.com/comp/def_content/rabbit-farming/04a9e07249-rabbit-farming-3-daarw-250.jpg' },
  { id: 'pigeon-feed', category: 'feeds', name: 'Pigeon Feed', nameTa: 'காக்கை தீவனம்', unit: 'Bag/Sack', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYBsaHqGE3U5qnEtMzmmcnO1lhIL96fn8iYgb_NRg_Hxg7OlU5z5TVOH0&s=10' },
]

const initialCustomer = {
  name: '',
  phone: '',
  option: 'Local Delivery',
  address: '',
}

function App() {
  const [activeCategory, setActiveCategory] = useState('turkey')
  const [cart, setCart] = useState([])
  const [isSplashVisible, setIsSplashVisible] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [customer, setCustomer] = useState(initialCustomer)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    const splashTimer = setTimeout(() => setIsSplashVisible(false), 2600)
    return () => clearTimeout(splashTimer)
  }, [])

  const visibleProducts = useMemo(
    () => products.filter((product) => product.category === activeCategory),
    [activeCategory],
  )

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id)

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })

    setIsCartOpen(true)
  }

  const updateCartQty = (productId, change) => {
    setCart((currentCart) =>
      currentCart.flatMap((item) => {
        if (item.id !== productId) return [item]

        const nextQty = item.quantity + change
        return nextQty > 0 ? [{ ...item, quantity: nextQty }] : []
      }),
    )
  }

  const handleCustomerChange = (event) => {
    const { name, value } = event.target
    setCustomer((current) => ({ ...current, [name]: value }))
  }

  const openWhatsApp = () => {
    const messageLines = [
      '*NEW ORDER / QUOTE REQUEST - Kings Turkey Farms & Feeds* 🦃',
      '',
      '*Customer Details:*',
      `Name: ${customer.name || 'Customer'}`,
      `Phone: ${customer.phone || 'Not provided'}`,
      `Option: ${customer.option}`,
      `Address: ${customer.address || 'Farm Pickup / Local Delivery'}`,
      '',
      '*Items Requested:*',
      ...cart.map(
        (item) => `${item.quantity} ${item.unit} x ${item.name}${item.newArrival ? ' (NEW ARRIVAL)' : ''}`,
      ),
      '',
      'Please reply with the current daily rates and availability for this request.',
    ]

    const whatsappUrl = `https://wa.me/918903470700?text=${encodeURIComponent(
      messageLines.join('\n'),
    )}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleOrderSubmit = async (event) => {
    event.preventDefault()

    if (!customer.name || !customer.phone || cart.length === 0) {
      setStatusMessage('Please fill in your name, phone number, and add at least one product.')
      return
    }

    const payload = {
      customerName: customer.name,
      phone: customer.phone,
      option: customer.option,
      address: customer.address,
      items: cart.map(({ id, name, quantity, unit }) => ({ id, name, quantity, unit })),
      createdAt: new Date().toISOString(),
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Order submission failed.')
      }

      const result = await response.json()
      setStatusMessage(result.message || 'Order saved successfully.')
      setCustomer(initialCustomer)
      setCart([])
      setIsCartOpen(false)
      setTimeout(() => setStatusMessage(''), 2400)
      return
    } catch (error) {
      console.error(error)
      setStatusMessage('Order queued locally and ready for WhatsApp follow-up.')
      setCustomer(initialCustomer)
      setCart([])
      setIsCartOpen(false)
      setTimeout(() => setStatusMessage(''), 2400)
      openWhatsApp()
    }
  }

  return (
    <div className="app-shell">
      <div className={`splash-screen ${isSplashVisible ? 'visible' : 'hidden'}`}>
        <img
          src="/logo.png"
          alt="Kings Farms and Feeds"
          className="splash-logo"
        />
      </div>

      <header className="site-header">
        <nav className="header-nav container">
          <div className="brand-lockup">
            <img
              src="/logo.png"
              alt="Kings Farms and Feeds Logo"
              className="brand-logo"
            />
            <div className="brand-copy">
              <strong>Kings Farms and Feeds</strong>
              <span>Purely Natural &amp; Organic</span>
            </div>
          </div>

          <div className="nav-links">
            <a href="#catalog">Catalog</a>
            <a href="#featured">Featured</a>
            <a href="#contact">Contact</a>
          </div>

          <button
            type="button"
            className="cart-trigger"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            🛒 <span>{cartCount}</span>
          </button>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-overlay" />
          <div className="container hero-content">
            <div className="hero-copy">
              <p className="eyebrow">Fresh from Kanyakumari farms</p>
              <h1>Kings Farms and Feeds</h1>
              <p className="subhead">
                Purely natural, organic turkey, poultry, and feed solutions for healthy,
                trusted family living.
              </p>

              <div className="trust-row">
                <span>🌿 100% Natural &amp; Organic</span>
                <span>⭐ High Quality Guaranteed</span>
                <span>🏆 15+ Years Trust in Kanyakumari</span>
              </div>

              <div className="hero-actions">
                <a href="#catalog" className="primary-btn">
                  Explore Farm Products
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="catalog-section container">
          <div className="section-header">
            <div>
              <p className="eyebrow dark">Farm catalog</p>
              <h2>Fresh from our farm to your table</h2>
            </div>
            <p>
              Premium quality poultry, organic feeds, and seasonal specialty products from
              Kings Turkey Farms &amp; Feeds.
            </p>
          </div>

          <div className="category-tabs" role="tablist" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={category.id === activeCategory ? 'tab active' : 'tab'}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article key={product.id} className={`product-card ${product.featured ? 'featured' : ''}`}>
                <div className="image-frame">
                  <img src={product.image} alt={product.name} />
                  {product.featured && (
                    <span className="new-badge">🔥 NEW ARRIVAL / புதிய வரவு</span>
                  )}
                </div>

                <div className="product-copy">
                  <div className="product-meta">
                    <span className="micro-badge">Organic</span>
                    <span className="unit-tag">{product.unit}</span>
                  </div>

                  <div className="product-title-wrap">
                    <h3>{product.name}</h3>
                    <p className="tamil-title">{product.nameTa}</p>
                  </div>

                  <div className="product-footer">
                    <div className="unit-block">
                      <span className="unit-text">Unit</span>
                      <strong>{product.unit}</strong>
                    </div>

                    <button
                      type="button"
                      className="add-button"
                      onClick={() => addToCart(product)}
                    >
                      Add to Quote
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="featured" className="cta-band container">
          <div>
            <p className="eyebrow dark">Trusted quality</p>
            <h2>Need a custom farm quote?</h2>
          </div>
          <button type="button" className="primary-btn" onClick={() => setIsCartOpen(true)}>
            Request WhatsApp Quote
          </button>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div className="footer-overlay" />
        <div className="container footer-grid">
          <div className="footer-copy">
            <p className="eyebrow">Kings Turkey Farms &amp; Feeds</p>
            <h3>Kings Farms and Feeds</h3>
            <p>Bethelpuram, Kanyakumari, Tamil Nadu</p>
            <p>Phone: +91 89034 70700</p>
            <p>Email: kingsturkeyfarm@gmail.com</p>
            <a href="https://wa.me/918903470700" target="_blank" rel="noreferrer">
              WhatsApp direct order
            </a>
          </div>

          <div className="map-box">
            <iframe
              title="Kings Farms Map"
              src="https://www.google.com/maps?q=Kanyakumari%20Tamil%20Nadu&z=12&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </footer>

      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <aside className="cart-panel" onClick={(event) => event.stopPropagation()}>
            <div className="cart-header">
              <h3>Your order</h3>
              <button type="button" className="close-btn" onClick={() => setIsCartOpen(false)}>
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <p>Your cart is empty. Add farm-fresh products to prepare a quote.</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-thumb">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="cart-copy">
                        <h4>{item.name}</h4>
                        <span>{item.unit}</span>
                        <strong>Qty: {item.quantity}</strong>
                      </div>

                      <div className="qty-control">
                        <button type="button" onClick={() => updateCartQty(item.id, -1)}>
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateCartQty(item.id, 1)}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <form className="checkout-form" onSubmit={handleOrderSubmit}>
                  <label>
                    <span>Name</span>
                    <input
                      type="text"
                      name="name"
                      value={customer.name}
                      onChange={handleCustomerChange}
                      placeholder="Your full name"
                    />
                  </label>

                  <label>
                    <span>Phone</span>
                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={handleCustomerChange}
                      placeholder="Mobile number"
                    />
                  </label>

                  <div className="option-row">
                    <label>
                      <input
                        type="radio"
                        name="option"
                        value="Local Delivery"
                        checked={customer.option === 'Local Delivery'}
                        onChange={handleCustomerChange}
                      />
                      Local Delivery
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="option"
                        value="Farm Pickup"
                        checked={customer.option === 'Farm Pickup'}
                        onChange={handleCustomerChange}
                      />
                      Farm Pickup
                    </label>
                  </div>

                  <label>
                    <span>Address</span>
                    <textarea
                      name="address"
                      value={customer.address}
                      onChange={handleCustomerChange}
                      placeholder="Street address or pickup note"
                    />
                  </label>

                  <div className="summary-box">
                    <span>Total Items</span>
                    <strong>{cartCount}</strong>
                  </div>

                  {statusMessage && <p className="status-message">{statusMessage}</p>}

                  <div className="checkout-actions">
                    <button type="submit" className="primary-btn submit-btn">
                      Save Quote Request
                    </button>
                    <button
                      type="button"
                      className="whatsapp-btn"
                      onClick={() => {
                        openWhatsApp()
                        setIsCartOpen(false)
                      }}
                    >
                      Request Quote via WhatsApp 💬
                    </button>
                  </div>
                </form>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}

export default App
