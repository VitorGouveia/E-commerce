import { FiHome, FiSettings } from "react-icons/fi"
import Link from "next/link"

const IconConfigurations = {
  size: "24px",
  color: "#fff"
}

const Sidebar = () => {
  return(
    <nav>
      <ul>
        <li>
          <Link href="/home">
            <>
              <FiHome 
                size={IconConfigurations.size}
                color={IconConfigurations.color}
              />

              <p>Home</p>
            </>
          </Link>
        </li>


        <li>
          <Link href="/configurations">
            <>
              <FiSettings
                size={IconConfigurations.size}
                color={IconConfigurations.color}
              />

              <p>Settings</p>
            </>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export { Sidebar }