import express from "express"
import compression from "compression"
import cors from "cors"
import helmet from "helmet"
import { config as dotenv } from "dotenv"
import { router as v1 } from "@api/v1.0/routes"

const app = express()

const router = express.Router()
router.use("/v1.0", v1)

dotenv({ path: '.env' })

app.use(express.json())
app.use(cors({ origin: process.env.APP_URL }))
app.use(helmet())
app.use(router)
app.use(compression())

export { app }