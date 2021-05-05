const getComponent = async componentName => {
  const response = await fetch(`./components/${componentName}.html`)
  const data = await response.text()
  createComponent(componentName, data)
}

const createComponent = async (component, data) => {
  const newComponent = document.createElement(component)
  newComponent.innerHTML = data

  document.querySelector(".homeContainer").appendChild(newComponent)
  
  const links = document.querySelectorAll("a")
  links.forEach(link => {
    link.addEventListener("click", event => {
      document.querySelector(".active-link").classList.remove("active-link")
      event.target.classList.add("active-link")
    })
  })

  const buttons = document.querySelectorAll(".sidebar-toggle")
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      document.querySelector(".homeContainer aside").classList.toggle("show")
      document.querySelector(".overlay").style.display = "block"
      
    })
  })

  document.querySelector(".overlay").addEventListener("click", () => {
    document.querySelector(".homeContainer aside").classList.remove("show")
    document.querySelector(".overlay").style.display = "none"
  })

  const clipboardButtons = document.querySelectorAll("button.clipboard")
  clipboardButtons.forEach(button => {
    button.addEventListener("click", async event => {
      // get text of code element
      const span = event.path[2].childNodes[1].childNodes[0].textContent
      const text = event.path[2].childNodes[1].childNodes[1].textContent
      const fullText = `${span}${text}`

      // copy to clipboard
      await navigator.clipboard.writeText(fullText)
    })
  })

  // addEventListener("scroll", e => console.log(e.path[1].scrollY))
}

export { getComponent }