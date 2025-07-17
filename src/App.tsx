import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Layout from "./components/Layout/Layout"
import Home from "./spa-pages/Home"
import About from "./spa-pages/About"
import Products from "./spa-pages/Products"
import Contact from "./spa-pages/Contact"
import "./index.css"

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#fff",
              border: "1px solid #D4AF37",
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
