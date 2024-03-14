import { describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import * as fs from 'node:fs/promises'

import server from '../server.ts'

vi.mock('node:fs/promises')

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
  it('lists the puppies in the data file', async () => {
    vi.mocked(fs.readFile).mockImplementation(async () =>
      JSON.stringify(testData, null, 2),
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
  it('response with a puppy from the data file', async () => {
    vi.mocked(fs.readFile).mockImplementation(async () =>
      JSON.stringify(testData, null, 2),
    )

    const res = await request(server).get('/api/v1/puppies/1')
    expect(res.statusCode).toBe(200)
    expect(res.body).toStrictEqual(testData.puppies[0])
  })
})

describe('editing puppies', () => {
  it('updates the correct puppy', async () => {
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
    let fileContents = JSON.stringify({ puppies }, null, 2)

    vi.mocked(fs.readFile).mockImplementation(async () => {
      return fileContents
    })

    vi.mocked(fs.writeFile).mockImplementation(
      async (filePath, data, encoding) => {
        if (typeof data === 'string') {
          fileContents = data
        }
      },
    )

    await request(server).patch('/api/v1/puppies/2').send({
      name: 'Sam',
      breed: 'Pug',
      owner: 'Fred',
      image: '/images/puppy3.jpg',
    })

    const res = await request(server).get('/api/v1/puppies')
    expect(res.statusCode).toBe(200)
    const data = res.body
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
