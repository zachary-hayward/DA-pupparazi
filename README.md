# Pupparazzi

Learning objectives:

1. Learn Express router
1. Practise using promises
1. Practise file-system methods

Our app is incomplete. We use a combination of tests and user stories to get it to work in the way we want it to. When complete, your application might look like this:

![Screenshot of a very simple page with the stylized title "Pupparazzi" and a link reading "Home" above a circular image of a puppy. All on a pink background](screenshot.png)

## Setup

### 0. Cloning and installation

- [ ] After cloning this repo, install dependencies with `npm install`, and start the dev server with `npm run dev`
  <details style="padding-left: 2em">
    <summary>More about getting started</summary>

  - To run the tests: `npm test`
  </details>

---

## Things to consider

<details>
  <summary>Important tips for completing the challenge</summary>

1. The order of routes is important. When your app is running, the first one that matches will be used. So if you have a `/:id` route before an `/edit` route, a request to `/edit` will choose the `/:id` route and the value of `req.params.id` will be `"edit"`.
1. There can only be one server response (e.g. `res.send()` or `res.json()`) per request. If you have multiple potential responses (like a success and an error response) make sure to write your logic so that the route responds appropriately.
1. Make sure to `JSON.parse` and `JSON.stringify` when reading/writing JSON data.
1. Don't forget to handle errors when your promises fail using `try { } catch (e) { }`
1. When in doubt check the [node `fs/promises` documentation](https://nodejs.org/api/fs.html#promises-api)
</details>
<br />

## Requirements

### 1. Getting started

Let's get familiar with the code base so you can begin to understand what needs to be done to get it to work.

- [ ] Firstly, have a look through the code. Familiarise yourself with the structure and different folders/files. Think about how data will move through the stack.

- [ ] If you have the development server running `npm run dev`, you can visit our site at http://localhost:5173. You'll see that a lot of the functionality is broken. In the network tab on your brower's development tools, you can see that our api calls are coming back as 404s.

- [ ] Notice how there are tests to test the data at different points of the stack. Run our tests with `npm test`, you'll see that our frontend tests are passing but our backend tests are failing

- [ ] Now that you have an idea of what is going on, let's get our first route going, set up a handler `GET /api/v1/puppies/` that returns an array of puppies

  <details style="padding-left: 2em">
    <summary>More about the server</summary>

  Create a new file at `server/routes/puppies.ts`. We'll put all our puppy related routes in here.

  In Express, we can group together routes that are related, like user routes or 'puppy' routes. We group them in what's called a "router". We can collect them together like this:

  ```js
  import express from 'express'

  const router = express.Router()
  export default router
  ```

  Then we'll add our root ('/') puppy route handler. For now, we'll just send an empty array:

  ```js
  router.get('/', async (req, res, next) => {
    res.json([])
  })
  ```

  Now let's hook up the router. In `server/server.ts` we first import our router.

  ```js
  import puppies from './routes/puppies.ts'
  ```

  Then we integrate our new router with `server.use` which we can then pass
  the prefix `/api/v1/puppies` we want to route from.

  ```js
  // make sure you have this line to set up the JSON middleware
  server.use(express.json())
  server.use('/api/v1/puppies', puppies)
  ```

  Start the server and go to http://localhost:5173/api/v1/puppies to see the JSON output

  Now that we have our basic setup, let's load some actual puppies.
  </details>

- [ ] Read our data from a JSON file
  <details>
    <summary>How to get data from the file system</summary>

  First we're going to need a file to read from, there's an example file in the repo called [example.json](./example.json) and before we get started let's copy it into the storage folder.

  We're going to call the copy "data.json". You can do this in VS Code or by running the following command.

  ```sh
  cp example.json ./storage/data.json
  ```

  There's an existing test for this feature. Run `npm test -- -t 'Listing all puppies'` and you should see a test failing

  Now we can update our [puppy routes](./server/routes/puppies.ts) to serve data from that file

  ```ts
  import * as FS from 'node:fs/promises'

  router.get('/', async (req, res) => {
    const json = await readFile('./storage/data.json', 'utf8')
    const data = JSON.parse(json)
    res.json(data)
  })
  ```

  Since both the `readFile()` and the `JSON.parse()` can fail in unpredictable ways, we'll wrap them both _and the `res.json()` call_ into a `try`/`catch` block.

  ```ts
  try {
    // the happy path goes here
  } catch (error: any) {
    // Something bad has happened!
    console.log('getting puppies failed', error)
    res.sendStatus(500)
  }
  ```

  Run the test `npm test -- -t 'Listing all puppies'` and you should see a test passing ✅

  And if you visit the browser now, you should be able to see our beautiful pups 😊

  </details>

### 2. Displaying the detailed puppy page

For this step, let's use a 'user story' to figure out what functionailty to build into our app.

- [ ] As a user, I want to click on a puppy and see their name, breed, and who their owner is.
  <details style="padding-left: 2em">
    <summary>More about puppy pages</summary>

  The frontend is set up for this, we just need to set up the API route that get's the data of a specific puppy using it's unique identifier (id). So our API route needs to include the `/:id` parameter (more on this soon!).

  For example: `GET /api/v1/puppies/1` will get a document that looks like this:

  ```json
  {
    "id": 1,
    "name": "Fido",
    "owner": "Fred",
    "image": "/images/puppy1.jpg",
    "breed": "Labrador"
  }
  ```

  Start by opening [puppies.tests.ts](./server/routes/puppies.test.ts), we can use the tests that are already there
  as a template.

  These new tests will do a different request:

  ```js
  const res = await request(server).get('/api/v1/puppies/1')
  ```

  and update the assertions in our new test to match what we expect, that they will return a JSON document representing a single puppy.

  If you run `npm test`, you'll see that our new tests are failing. That's great! Now let's make them green again.

  Write a function that gets an array of _all the puppies_ and then returns one with a matching ID if it
  exists or undefined otherwise. You can probably re-use the code we used to get all the puppies previously

  You can start with something like this:

  ```ts
  import type { Puppy } from '../models/Puppy.ts'

  async function getPuppyById(id: number): Promise<Puppy | undefined> {
   ...
  }
  ```

  You can either loop through the puppies or use [`array.find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

  Next, add a new route handler in [`puppies.ts`](./server/routes/puppies.ts) which uses a route param:

  ```js
  router.get('/:id', async (res, req, next) => {
    const id = Number(req.params.id)
    console.log(id)
  })
  ```

  Using the `:` in route pattern like that means that `:id` is a path parameter, e.g. it will match `/api/v1/puppies/1` and req.params will look like this: `{ id: '1' }`

  Use that `id` variable to call `getPuppyById`. If it resolves with a Puppy you can call `res.json(puppy)` but
  if the it doesn't find one (i.e. `puppy` is `undefined`), the we should `res.sendStatus(404)` the HTTP Status code for [Not Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404).

  If everything went well, then the tests you wrote should be passing now.

  Hit `http://localhost:5173/api/v1/puppies/1` in Thunderclient, Insomnia or Bruno (or your other favourite Rest API Client) and confirm that it's showing what you expect.

  Visit the page at `http://localhost:5173/1` to confirm that the individual puppy view is working.
  </details>

### 3. Updating a puppy

Let's use another user story:

- [ ] As a user, I want to be able to update the puppy's name, breed, and owner
    <details style="padding-left: 2em">
      <summary>More about pupdates</summary>

  Visit `http://localhost:5173/2/edit` to see the edit form. This is already hooked up to
  our API to load the values. Now to save the values we need a new route at `PATCH /api/v1/puppies/:id`

  However if you submit the form, you likely get an error.

  Run this test to confirm `npm test -- -t 'editing puppies' and you should see a failure.

  First, we'll take care of the data-handling side of it.

  ```ts
  import type { PuppyData } from '../models/Puppy.ts'

  async function updatePuppy(id: number, data: PuppyData): Promise<void> {
    ...
  }
  ```

  In this function:

  1. call `getPuppies()` to get the list of puppies
  1. locate a puppy with the matching ID
  1. update or replace that puppy in the array
  1. Write the entire array back to `./storage/data.json`, remember that the correct encoding for a JSON file is `'utf8'`

  Now we'll add a route in [puppiest.ts](./server/routes/puppies.ts):

  ```ts
  router.patch('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      await store.updatePuppy(id, req.body)
      res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  })
  ```

  Now run your test again `npm test -- -t 'editing puppies'` and you should see it passing ✅

  You should be able to update a puppy in the browser and see the `data.json` file updated with the new information. You will also see the updated puppies on the homepage.

  Commit, push and you could now submit your branch for the CP07 Trello ticket 😊

  </details>

## Stretch

<details>
  <summary>More about stretch challenges</summary>

If you've reached this point, congratulations! As a stretch, you might like to do the following:

1. Refactor the `readFile` and `writeFile` calls into a separate file (separation of concerns)
   - As these return promises to begin with, you will need to write functions around them which also return promises
1. Add a new react component and client-side route that shows a form which lets the user add a new puppy
</details>

## E2E tests and submitting this challenge for marking

<details>
  <summary>How to submit this challenge</summary>

This challenge can be used for the following assessments:

- WD01: Build an HTTP server with a restful JSON API

This challenge ships with some end-to-end tests written in playwright, if you are submitting this
challenge to complete an NZQA requirement, please make sure these tests are passing _before_ you submit.

Read this short guide on [how to run them](./doc/end-to-end-testing.md).

</details>

---

[Provide feedback on this repo](https://docs.google.com/forms/d/e/1FAIpQLSfw4FGdWkLwMLlUaNQ8FtP2CTJdGDUv6Xoxrh19zIrJSkvT4Q/viewform?usp=pp_url&entry.1958421517=pupparazzi)
