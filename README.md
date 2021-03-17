# Youtube searcher

Check the [Demo](https://chifangchen.github.io/youtube-searcher/)

---

## Introduction

This project was developed by `React` `Styled Component` & `TypeScript`.

I choose `Material UI` as the design framework. When typing in the search input, it will `debounce` the request of getting the data from API. I also build the code as server-side render files to improve `SEO`. There are two `language` versions provided.

When you reach the bottom of the list block, it will automatically load more data from the API and append the new ones to the list. However, if there is no more data, it will show a message to info you.

You can scroll up right away by clicking the _back to top button_ when it shows.

---

## Code design

Only 1 page in the APP.

All components are placed in the `components` folder, and all hooks are placed in the `hooks` folder.

Common functions and variables are defined in the `utils` folder.

---

## Activate the APP

- Clone the repo
- `npm install`
- `npm start`
