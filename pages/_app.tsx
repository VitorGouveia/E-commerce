import "../styles/global.css"

import "../styles/components/Header.css"
import "../styles/components/Sidebar.css"
import "../styles/home.css"

import { Sidebar } from "./components/Sidebar"

const app = ({ Component, pageProps }) => {
  return (
    <>
      <Sidebar />
      <Component {...pageProps} />
    </>
  )
}

export default app