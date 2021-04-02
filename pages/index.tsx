import { Sidebar } from "./components/Sidebar"
import { Header } from "./components/Header"

const Home = () => {
  return(
    <div id="app">
      <Sidebar />
      <main>
        <Header page="home" />
      </main>
    </div>
  )
}

export default Home