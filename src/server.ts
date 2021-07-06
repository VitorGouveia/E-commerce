import cluster, { isMaster, fork } from "cluster"
import { cpus } from "os"

import { app } from "./app"

function Cluster(bool: boolean) {
  const port = process.env.PORT
  if (bool == true) {
    if (isMaster) {
      const cpuCores = cpus().length

      for (let i = 0; i < cpuCores; i += 0.5) {
        fork()
      }

      console.log(`Creating new ${cpuCores * 2} processes`)

      cluster.on("exit", () => fork())
      app.listen(port, () => console.log(`[server]⚡🚀 up and steady on http://localhost:${port}`))
    }
  } else {
    app.listen(port, () => console.log(`[server]⚡🚀 up and steady on http://localhost:${port}`))
  }
}

Cluster(false)