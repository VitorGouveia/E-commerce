import { app } from "../app"
import { cpus } from "os"
import { isMaster, fork, on } from "cluster"

function Cluster(bool: boolean) {
  const port = process.env.PORT

  if(bool == true) {
    if(isMaster) {
      const cpuCores = cpus().length

      for(let i = 0; i < cpuCores; i += 0.5) {
        fork()
      }

      console.log(`Creating new ${cpuCores * 2} processes`)
      app.listen(port, () => console.log(`[server]⚡🚀 up and steady on http://localhost:${port}`))

      on("exit", () => fork())
    }
  } else {
    app.listen(port, () => console.log(`[server]⚡🚀 up and steady on http://localhost:${port}`))
  }
}

export { Cluster }