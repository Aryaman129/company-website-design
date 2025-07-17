"use client"

import dynamic from "next/dynamic"

// 👉  load React-Router app only in the browser
const App = dynamic(() => import("../src/App"), { ssr: false })

export default function Page() {
  return <App />
}
