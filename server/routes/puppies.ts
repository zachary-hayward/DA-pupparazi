import express from "express"
import * as store from "../store.ts"

const router = express.Router()

router.get('/', async (req, res) => {
  const data = await store.getPuppies()
  res.json(data)
})

router.get('/:id', async (req, res) => {
  const {id} = req.params
  const data = await store.getPuppyById(id)
  if (data !== undefined) {
    res.json(data)
  } 
  else {
    res.sendStatus(404)
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await store.updatePuppy(id, req.body)
    res.sendStatus(204)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

export default router

// router.patch('/:id', async (req, res) => {
//     try {
//       const id = Number(req.params.id)
//       await store.updatePuppy(id, req.body)
//       res.sendStatus(204)
//     } catch (error) {
//       console.error(error)
//       res.sendStatus(500)
//     }
//   })