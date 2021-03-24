import express from "express"
import cors from "cors"
import { config as dotenv } from "dotenv"
import { router } from "./routes"

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)

dotenv({ path: `${__dirname}/config/.env` })

export { app }