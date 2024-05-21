import type { Puppy } from '../models/Puppy.ts'
import * as fs from 'node:fs/promises'
import * as Path from 'node:path'

const dataPath = './storage/data.json'

interface Data {
  puppies: Puppy[]
}

export async function getPuppies() {
  try {
    const json = await fs.readFile(Path.resolve(dataPath), 'utf-8')
    const data = JSON.parse(json)
    return data as Data
  } catch (error) {
    throw new Error
  }
}

export async function getPuppyById(id: string) {
  const data = await getPuppies()
  const puppy = data.puppies.find(pup => pup.id === Number(id))
  return puppy as Puppy
}

export async function updatePuppy(id: number, newData: Puppy) {
  try {
    const data = await getPuppies()
    const dataIndex = data.puppies.findIndex(pup => pup.id === id)
    data.puppies[dataIndex] = newData
    await fs.writeFile(Path.resolve(dataPath), JSON.stringify(data), 'utf-8')
  } catch (error) {
    throw new Error
  }
}

// 1. call `getPuppies()` to get the list of puppies
// 1. locate a puppy with the matching ID
// 1. update or replace that puppy in the array
// 1. Write the entire data object to a file in the `storage` folder (with `fs.writeFile`).
//  We will call this file data.json. 
//  You don't have to explicitly create this file, the `writeFile` function will do it for you as long as the path is correct.