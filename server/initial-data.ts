import type { PuppyData, Puppy } from '../models/Puppy.ts'
import * as initialData from '../example.json'

interface Data {
  puppies: Puppy[]
}

export async function getPuppies(): Promise<Data> {
  return initialData
}