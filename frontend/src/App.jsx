import './App.css'

function App() {
  return (
    <div className="site">

      {/* Navigation */}
      <header className="navbar">
        <div className="container nav-content">
          <div className="logo">
            <span className="logo-mark">N</span>
            <div>
              <strong>NadiaFirm</strong>
              <small>Systems & Services</small>
            </div>
          </div>

          <nav>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#technical">Technical Solutions</a>
            <a href="#administrative">Administrative Services</a>
            <a href="#products">Products</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <p className="eyebrow">NADIAFIRM SYSTEMS & SERVICES</p>

            <h1>
              Practical Solutions.
              <br />
              Reliable Service.
            </h1>

            <p className="hero-description">
              Technical and administrative solutions designed to help
              individuals, businesses, and organizations operate effectively.
            </p>

            <div className="hero-buttons">
              <a href="#technical" className="btn btn-primary">
                Explore Our Services
              </a>

              <a href="#contact" className="btn btn-secondary">
                Contact Us
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="solar-icon">☀</div>
            <h2>Powering Better Solutions</h2>
            <p>
              Solar, inverter, power solutions and dependable technical
              support for homes and businesses.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section">
        <div className="container">
          <p className="section-label">WHO WE ARE</p>
          <h2>Solutions Built Around Your Needs</h2>

          <p className="section-intro">
            NadiaFirm Systems & Services provides practical, reliable, and
            professional technical and administrative solutions for
            individuals, businesses, and organizations.
          </p>

          <div className="about-grid">
            <div className="info-card">
              <h3>Technical Solutions</h3>
              <p>
                We specialize in solar and inverter installation, power
                solutions, energy assessment, system sizing, installation,
                and technical support.
              </p>
            </div>

            <div className="info-card">
              <h3>Administrative Support</h3>
              <p>
                We help businesses stay organized and productive through
                documentation, coordination, scheduling, data-related tasks,
                and general administrative assistance.
              </p>
            </div>

            <div className="info-card">
              <h3>Reliable Support</h3>
              <p>
                We focus on understanding the problem, recommending practical
                solutions, and providing dependable support to our clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Services */}
      <section id="technical" className="section section-light">
        <div className="container">
          <p className="section-label">TECHNICAL SOLUTIONS</p>
          <h2>Power & Solar Solutions</h2>

          <div className="service-grid">
            <div className="service-card">
              <span>☀️</span>
              <h3>Solar Solutions</h3>
              <p>
                Solar system assessment, design support and installation
                solutions for homes and businesses.
              </p>
            </div>

            <div className="service-card">
              <span>⚡</span>
              <h3>Inverter Solutions</h3>
              <p>
                Inverter and backup power solutions selected according to
                your actual energy requirements.
              </p>
            </div>

            <div className="service-card">
              <span>🔋</span>
              <h3>Energy Storage</h3>
              <p>
                Battery and energy-storage solutions designed to improve
                power availability and system reliability.
              </p>
            </div>

            <div className="service-card">
              <span>🔧</span>
              <h3>Installation & Support</h3>
              <p>
                Professional installation, system support and practical
                technical assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Administrative */}
      <section id="administrative" className="section">
        <div className="container">
          <p className="section-label">ADMINISTRATIVE SERVICES</p>
          <h2>Helping Your Business Stay Organized</h2>

          <div className="admin-grid">
            <div>
              <h3>Documentation</h3>
              <p>
                Support with preparing, organizing and maintaining essential
                business documentation.
              </p>
            </div>

            <div>
              <h3>Data Support</h3>
              <p>
                Assistance with data-related operational tasks and
                information organization.
              </p>
            </div>

            <div>
              <h3>Scheduling & Coordination</h3>
              <p>
                Helping businesses coordinate activities, appointments and
                essential operational tasks.
              </p>
            </div>

            <div>
              <h3>General Administrative Assistance</h3>
              <p>
                Practical support for everyday administrative activities so
                you can focus on your core business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="section section-light">
        <div className="container">
          <p className="section-label">PRODUCTS</p>
          <h2>Power Products & Equipment</h2>

          <p className="section-intro">
            Browse our range of solar and power products. Our product
            catalogue will later connect directly to the NadiaFirm database.
          </p>

          <div className="product-grid">
            <div className="product-card">
              <div className="product-placeholder">☀️</div>
              <h3>Solar Panels</h3>
              <p>High-quality solar panels for residential and commercial applications.</p>
            </div>

            <div className="product-card">
              <div className="product-placeholder">⚡</div>
              <h3>Solar Inverters</h3>
              <p>Reliable inverter solutions for different power requirements.</p>
            </div>

            <div className="product-card">
              <div className="product-placeholder">🔋</div>
              <h3>Batteries</h3>
              <p>Energy-storage solutions for backup and solar applications.</p>
            </div>

            <div className="product-card">
              <div className="product-placeholder">🔌</div>
              <h3>Accessories</h3>
              <p>Essential equipment and accessories for solar installations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why NadiaFirm */}
      <section className="section">
        <div className="container">
          <p className="section-label">WHY NADIAFIRM</p>
          <h2>What We Stand For</h2>

          <div className="values-grid">
            <div>
              <strong>Reliability</strong>
              <p>Solutions and support you can depend on.</p>
            </div>

            <div>
              <strong>Professionalism</strong>
              <p>We approach every assignment with care and responsibility.</p>
            </div>

            <div>
              <strong>Responsiveness</strong>
              <p>We listen, communicate and respond to our clients' needs.</p>
            </div>

            <div>
              <strong>Customer Satisfaction</strong>
              <p>We focus on practical solutions that address real needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact-section">
        <div className="container contact-content">
          <div>
            <p className="section-label">GET IN TOUCH</p>
            <h2>Let's Find the Right Solution for You</h2>
            <p>
              Whether you need a solar and power solution or administrative
              support, NadiaFirm Systems & Services is ready to help.
            </p>
          </div>

          <a href="mailto:info@nadiafirm.com" className="btn btn-primary">
            Contact NadiaFirm
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container footer-content">
          <div>
            <strong>NadiaFirm Systems & Services</strong>
            <p>Practical solutions, reliable service, and support you can count on.</p>
          </div>

          <p>© 2026 NadiaFirm Systems & Services. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

export default App
