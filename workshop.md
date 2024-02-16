# Pupparazzi Workshop

## Learning Objectives:
1. Learn Express router
2. Practice using promises
3. Practice testing and TDD (test driven development)

## Setup

### 0. Cloning and installation

- [ ] Clone this repo, navigate to it, install dependencies with `npm install`, and start the dev server with `npm run dev`

---

## Things to Consider

<details>
  <summary>Important tips for completing the challenge</summary>

1. The order of routes is important. When your app is running, the first one that matches will be used.
2. There can only be one server response (`res.send()` or `res.json()`) per request.
3. Make sure to `JSON.parse` and `JSON.stringify` when reading/writing JSON data.
4. Don't forget to handle errors when your promises fail using `try { } catch (e) { }`
5. Check the [node `fs/promises` documentation](https://nodejs.org/api/fs.html#promises-api) for reference.

</details>
<br />

## Requirements

### 1. Take a look around

- [ ] Familiarize yourself with the code base.
- [ ] Visit `http://localhost:5173` and `http://localhost:5173/api/v1/puppies` to understand current functionality.
- [ ] Run tests with `npm test` and observe failing backend tests.
- [ ] Set up a route handler `GET /api/v1/puppies/` that returns an array of puppies.

<details style="padding-left: 2em">
    <summary> STOP! and find another pair</summary>

    - After attempting this stage, stop and find another pair who has reached the same stage. 
      Share your solutions and discuss any challenges faced.
</details>

### 2. Displaying the Detailed Puppy Page

- [ ] Implement a route `GET /api/v1/puppies/:id` to fetch details of a specific puppy.
- [ ] Update frontend to allow users to click on a puppy and see their details.

<details style="padding-left: 2em">
    <summary> STOP! and find another pair</summary>

    - After attempting this stage, stop and find another pair who has reached the same stage. 
      Share your solutions and discuss any challenges faced.
</details>

### 3. Updating a Puppy

- [ ] Implement a route `PATCH /api/v1/puppies/:id` to update a puppy's details.
- [ ] Update frontend to allow users to edit and update a puppy's details.

<details style="padding-left: 2em">
    <summary> STOP! and find another pair</summary>

    - After attempting this stage, stop and find another pair who has reached the same stage. 
      Share your solutions and discuss any challenges faced.
</details>

## 4. Add a Puppy


- [ ] Add a new React component and client-side route to allow users to add a new puppy.

<details style="padding-left: 2em">
    <summary> STOP! and find another pair</summary>

    - After attempting this stage, stop and find another pair who has reached the same stage. 
      Share your solutions and discuss any challenges faced.
</details>

## 5. Add a new animal 

## 6. Tests and Submission

<details>
  <summary>E2E Testing and Submission</summary>

- Run end-to-end tests with playwright.
- Ensure all tests are passing before submission.

Read the [guide on running E2E tests](./doc/end-to-end-testing.md) for details.

</details>

<details style="padding-left: 2em">
    <summary> STOP! and find another pair</summary>

    - After attempting this stage, stop and find another pair who has reached the same stage. 
      Share your solutions and discuss any challenges faced.
</details>

---

[Provide feedback on this repo](https://docs.google.com/forms/d/e/1FAIpQLSfw4FGdWkLwMLlUaNQ8FtP2CTJdGDUv6Xoxrh19zIrJSkvT4Q/viewform?usp=pp_url&entry.1958421517=pupparazzi)

