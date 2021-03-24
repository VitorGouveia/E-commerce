import express from "express"
import { config as dotenv } from "dotenv"
import { router } from "./routes"

const app = express()

app.use(express.json())
app.use(router)

dotenv({ path: `${__dirname}/config/.env` })

export { app }