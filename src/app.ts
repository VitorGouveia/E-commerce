import express from "express"
import cors from "cors"
import helmet from "helmet"
import { config as dotenv } from "dotenv"
import { router } from "./routes"

const app = express()

dotenv({ path: `${__dirname}/config/.env` })

app.use(express.json())
app.use(cors({ origin: process.env.APP_PORT }))
app.use(helmet())
app.use(router)


export { app }