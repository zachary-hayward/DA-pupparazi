import { describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import * as fs from 'node:fs/promises'
import { existsSync } from 'node:fs'

import server from '../server.ts'

vi.mock('node:fs/promises')
vi.mock('node:fs')

const testData = {
  puppies: [
    {
      id: 1,
      name: 'Coco',
      owner: 'James',
      breed: 'Pug',
      image: '/images/dog1.jpg',
    },
    {
      id: 2,
      name: 'Fido',
      owner: 'Jimmy',
      breed: 'Dog',
      image: '/images/dog2.jpg',
    },
    {
      id: 3,
      name: 'Kermit',
      owner: 'Jerm',
      breed: 'Frog',
      image: '/images/dog3.jpg',
    },
  ],
}

describe('Listing all puppies', () => {
  it("lists the default puppies when there's no data file", async () => {
    vi.mocked(fs.readFile).mockImplementation(() => {
      // ERROR: this file does not exist
      const error = new Error()
      error.message = 'No such file'
      // @ts-expect-error error doesn't have property .code
      error.code = 'ENOENT'
      throw error
    })

    const res = await request(server).get('/api/v1/puppies')
    expect(res.statusCode).toBe(200)
    expect(res.body).toStrictEqual([
      {
        breed: 'Labrador',
        id: 1,
        image: '/images/puppy1.jpg',
        name: 'Fido',
        owner: 'Fred',
      },
      {
        breed: 'Labrador',
        id: 2,
        image: '/images/puppy2.jpg',
        name: 'Coco',
        owner: 'Chloe',
      },
      {
        breed: 'Rottweiler',
        id: 3,
        image: '/images/puppy3.jpg',
        name: 'Magnum',
        owner: 'Michael',
      },
      {
        breed: 'Labrador',
        id: 4,
        image: '/images/puppy4.jpg',
        name: 'Sadie',
        owner: 'Sam',
      },
      {
        breed: 'Pug',
        id: 5,
        image: '/images/puppy5.jpg',
        name: 'Murphy',
        owner: 'Matthew',
      },
      {
        breed: 'Labrador',
        id: 6,
        image: '/images/puppy6.jpg',
        name: 'Bella',
        owner: 'Brianna',
      },
      {
        breed: 'Labrador',
        id: 7,
        image: '/images/puppy7.jpg',
        name: 'Rocky',
        owner: 'Ricky',
      },
    ])
    expect(fs.readFile).toHaveBeenCalled()
  })

  it('lists the puppies in the data file if it exists', async () => {
    vi.mocked(fs.readFile).mockImplementation(async () =>
      JSON.stringify(testData, null, 2)
    )

    const res = await request(server).get('/api/v1/puppies')
    expect(res.statusCode).toBe(200)
    expect(res.body).toStrictEqual([
      {
        breed: 'Pug',
        id: 1,
        image: '/images/dog1.jpg',
        name: 'Coco',
        owner: 'James',
      },
      {
        breed: 'Dog',
        id: 2,
        image: '/images/dog2.jpg',
        name: 'Fido',
        owner: 'Jimmy',
      },
      {
        breed: 'Frog',
        id: 3,
        image: '/images/dog3.jpg',
        name: 'Kermit',
        owner: 'Jerm',
      },
    ])
  })
})

describe('Reading a specific puppy', () => {
  it("responds with a default puppy when there's no data file", async () => {
    vi.mocked(fs.readFile).mockImplementation(() => {
      // ERROR: this file does not exist
      const error = new Error()
      error.message = 'No such file'
      // @ts-expect-error error doesn't have property .code
      error.code = 'ENOENT'
      throw error
    })

    const res = await request(server).get('/api/v1/puppies/1')
    expect(res.statusCode).toBe(200)
    expect(res.body).toStrictEqual({
      breed: 'Labrador',
      id: 1,
      image: '/images/puppy1.jpg',
      name: 'Fido',
      owner: 'Fred',
    })
    expect(fs.readFile).toHaveBeenCalled()
  })

  it('response with a puppy from the data file if it exists', async () => {
    vi.mocked(fs.readFile).mockImplementation(async () =>
      JSON.stringify(testData, null, 2)
    )

    const res = await request(server).get('/api/v1/puppies/1')
    expect(res.statusCode).toBe(200)
    expect(res.body).toStrictEqual(testData.puppies[0])
  })
})

describe('editing puppies', () => {
  it('updates the correct puppy', async () => {
    vi.mocked(fs.readFile).mockImplementation(async () => {
      const puppies = [
        {
          id: 1,
          name: 'Fido',
          owner: 'Fred',
          image: '/images/puppy1.jpg',
          breed: 'Labrador',
        },
        {
          id: 2,
          name: 'Coco',
          owner: 'Chloe',
          image: '/images/puppy2.jpg',
          breed: 'Labrador',
        },
      ]
      // simulate a data file with only two puppies... a sad state
      return JSON.stringify({ puppies }, null, 2)
    })
    vi.mocked(fs.writeFile).mockImplementation(async () => {})

    const res = await request(server).patch('/api/v1/puppies/2').send({
      name: 'Sam',
      breed: 'Pug',
      owner: 'Fred',
      image: '/images/puppy3.jpg',
    })

    const lastCall = vi.mocked(fs.writeFile).mock.lastCall
    const json = lastCall?.[1] as string
    const data = JSON.parse(json)

    // this is what should be written back to the data file
    expect(data).toEqual({
      puppies: [
        {
          id: 1,
          name: 'Fido',
          owner: 'Fred',
          image: '/images/puppy1.jpg',
          breed: 'Labrador',
        },
        {
          id: 2,
          name: 'Sam',
          breed: 'Pug',
          owner: 'Fred',
          image: '/images/puppy3.jpg',
        },
      ],
    })
  })
})
