import express from "express"
import { getPuppies } from "../initial-data"

const router = express.Router()

router.get('/', async (req, res) => {
  const data = await getPuppies()
  res.json(data)
})

export default router