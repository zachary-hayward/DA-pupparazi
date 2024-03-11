# Pupparazzi Workshop

## Learning Objectives:

1. Learn Express router
2. Practice using promises

## Setup

### 0. Cloning and installation

- [ ] Clone this repo, navigate to it, install dependencies with `npm install`, and start the dev server with `npm run dev`

---

## Things to Consider

<details>
  <summary>Important tips for completing the challenge</summary>

1. The order of routes is important. When your app is running, the first one that matches will be used. So if you have a `/:id` route before an `/edit` route, a request to `/edit` will choose the `/:id` route and the value of `req.params.id` will be `"edit"`.
1. There can only be one server response (e.g. `res.send()` or `res.json()`) per request. If you have multiple potential responses (like a success and an error response) make sure to write your logic so that the route responds appropriately.
1. Make sure to `JSON.parse` and `JSON.stringify` when reading/writing JSON data.
1. Don't forget to handle errors when your promises fail using `try { } catch (e) { }`
1. When in doubt check the [node `fs/promises` documentation](https://nodejs.org/api/fs.html#promises-api)
</details>
<br />

---

## 1. Take a look around and list all puppies

- [ ] As a user, I want to see a list off all the puppies.

Let's get familiar with the code base so you can begin to understand what needs to be done to get it to work.

- Firstly, have a look through the code. Familiarise yourself with the structure and different folders/files. Think about how data will move through the stack.

- If you have the development server running `npm run dev`, you can visit our site at http://localhost:5173. You'll see that a lot of the functionality is broken. In the network tab on your brower's development tools, you can see that our api calls are coming back as 404s.

- Notice how there are tests to test the data at different points of the stack. Run our tests with `npm test`, you'll see that our frontend tests are passing but our backend tests are failing

Now that you have an idea of what is going on, let's get our first route going, set up a handler `GET /api/v1/puppies/` that returns an array of puppies

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
router.get('/', async (req, res) => {
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

Use the 'default' puppies from `server/initial-data.ts`

  <details>
    <summary>More about our 'default' puppies</summary>

Since `initial-data.ts` is part of our source code, we can `import` it. Notice the `export default` for the puppies data which allows us to import it.

In `store.ts` we have defined a function called `getPuppies`, that (for now) just returns your initial-data wrapped in a promise.

Now back in your puppy route handler, have it send this data instead of the empty array. You should now be able to see some puppies in the frontend.

```ts
import * as store from '../store.ts'

router.get('/', async (req, res) => {
  const data = await store.getPuppies()
  res.json(data)
})
```

Check for updates in your tests. One of our backend tests should be passing now. Take a look at the tests and try to understand why that one is passing and the others aren't.

And if you visit the browser now, you should be able to see our beautiful pups :)

  </details>

- [ ] Read the updated puppies from `storage/data.json`

  <details>
    <summary>Reading puppies from our data file</summary>

  Since `initial-data.ts` is part of our source code, it won't change while the app is running.

  Instead we'll write out puppies to a file in `storage` called `data.json`

  We'll do this by updating the `getPuppies` function to use the file system.

  Use `readFile` from `node:fs/promises` to read the JSON file, and `JSON.parse(...)` to translate the string into a JavaScript object.

  If the file doesn't exist, `readFile` will throw a special error with the code `ENOENT`. We can check for this specific error and return our initial data as a fallback. For any other error we will re-`throw` it

  ```js
  try {
    const json = await fs.readFile(...)
    ...
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return initialData
    }

    throw error
  }
  ```

  When you've finished this, our route tests should pass.

  Create a JSON file in `./storage/data.json` and put some puppies in it, you can base it on what we export from `./initial-data.ts` but remember that JSON syntax is a little different, e.g. we have to have double-quotes around all our keys and trailing commas are illegal

  When you load up the website you should be able to see your new puppies instead of the defaults.

<details style="padding-left: 2em">
    <summary> STOP! and find another pair</summary>

    - After attempting this stage, stop and find another pair who has reached the same stage.
      Share your solutions and discuss any challenges faced.

</details>

---

## 2. Displaying a detailed single puppy page

- [ ] As a user, I want to click on a puppy and see their name, breed, and who their owner is.

For this step we will implement a route `GET /api/v1/puppies/:id` to fetch details of a specific puppy. We will update frontend to allow users to click on a puppy and see their details.

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

If you run `npm test`, you'll see the tests for "Reading a specific puppy" are red. That's great! Now let's make them green again.

Write a function that gets an array of _all the puppies_ and then returns one with a matching ID if it
exists or undefined otherwise. You can probably re-use the function you wrote to get all the puppies previously

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
router.get('/:id', async (res, req) => {
  const id = Number(req.params.id)
  console.log(id)
})
```

Using the `:` in route pattern like that means that `:id` is a path parameter, e.g. it will match `/api/v1/puppies/1` and req.params will look like this: `{ id: '1' }`

Use that `id` variable to call `getPuppyById`. If it resolves with a Puppy you can call `res.json(puppy)` but
if the it doesn't find one (i.e. `puppy` is `undefined`), the we should `res.sendStatus(404)` the HTTP Status code for [Not Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404).

If everything went well, then the tests under "Reading a specific puppy" should be passing now

Hit `http://localhost:5173/api/v1/puppies/1` in Thunderclient (or your other favourite Rest API Client) and confirm that it's showing what you expect.

Visit the page at `http://localhost:5173/1` to confirm that the individual puppy view is working.

  </details>

<details style="padding-left: 2em">
    <summary> STOP! and find another pair</summary>

    - After attempting this stage, stop and find another pair who has reached the same stage.
      Share your solutions and discuss any challenges faced.

</details>

---

## 3. Updating a puppy

- [ ] As a user, I want to be able to update the puppy's name, breed, and owner

For this step you will implement a route `PATCH /api/v1/puppies/:id` to update a puppy's details. You will update frontend to allow users to edit and update a puppy's details.

<details style="padding-left: 2em">
    <summary>More about pupdates</summary>

Visit `http://localhost:5173/2/edit` to see the edit form. This is already hooked up to our API to load the values.

We should already have a red test under 'editing puppies', let's make it green.

Now to save the values we need a new route at `PATCH /api/v1/puppies/:id`

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
1. Write the entire data object to a file in the `storage` folder (with `fs.writeFile`). We will call this file data.json. You don't have to explicitly create this file, the `writeFile` function will do it for you as long as the path is correct.

Now we'll add a route in [puppiest.ts](./server/routes/puppies.ts):

```ts
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
```

The last of your tests should be passing now.

Load the website up in chrome and edit a puppy, observe how it makes changes in `data.json` and how the changes persist even if you stop and restart the server.

Commit, push and you could now submit your branch for the CP07 Trello ticket :)

  </details>

<details style="padding-left: 2em">
    <summary> STOP! and find another pair</summary>

    - After attempting this stage, stop and find another pair who has reached the same stage.
      Share your solutions and discuss any challenges faced.

</details>

---

## 4. Stretch: Adding a new puppy

- [ ] As a user, I want to add a new puppy.

For this step you will add a new react component and client-side route that shows a form which lets the user add a new puppy.

<details style="padding-left: 2em">
    <summary> STOP! and find another pair</summary>

    - After attempting this stage, stop and find another pair who has reached the same stage.
      Share your solutions and discuss any challenges faced.

</details>

---

## 5. Stretch: Adding a new animal

- [ ] As a user, I want to add a new animal.

For this step, challenge yourself to add a new animal. Maybe you want to display cats? Or iguanas? Or maybe a collection of stick insects? Think about how the user experience and how you can update the app to accommodate different animals.

<details style="padding-left: 2em">
    <summary> STOP! and find another pair</summary>

    - After attempting this stage, stop and find another pair who has reached the same stage.
      Share your solutions and discuss any challenges faced.

</details>

## E2E tests and submitting this challenge for marking

<details>
  <summary>How to submit this challenge</summary>

This challenge can be used for the following assessments:

- WD01: Build an HTTP server with a restful JSON API

This challenge ships with some end-to-end tests written in playwright, if you are submitting this
challenge to complete an NZQA requirement, please make sure these tests are passing _before_ you submit.

## Read this short guide on [how to run them](./doc/end-to-end-testing.md).

[Provide feedback on this repo](https://docs.google.com/forms/d/e/1FAIpQLSfw4FGdWkLwMLlUaNQ8FtP2CTJdGDUv6Xoxrh19zIrJSkvT4Q/viewform?usp=pp_url&entry.1958421517=pupparazzi)
