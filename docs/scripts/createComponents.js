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

  const buttons = document.querySelectorAll("button")
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
}

export { getComponent }