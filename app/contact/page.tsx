"use client"

import Contact from "../../src/spa-pages/Contact"
import Layout from "../../src/components/Layout/Layout"
import { Toaster } from "react-hot-toast"

export default function ContactPage() {
  return (
    <>
      <Layout>
        <Contact />
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
    </>
  )
}
