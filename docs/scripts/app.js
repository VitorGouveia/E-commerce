const $ = document.querySelector.bind(document)

const getSidebar = async componentName => {
  const response = await fetch(`../components/${componentName}.html`)
  const data = await response.text()
  createComponent(componentName, data)
}

const createComponent = async (component, data) => {
  const newComponent = document.createElement(component)
  newComponent.innerHTML = data
  document.body.appendChild(newComponent)
}

getSidebar("Sidebar")