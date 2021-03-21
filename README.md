# Youtube searcher

Check the [Demo](https://chifangchen.github.io/youtube-searcher/)

---

## Introduction

This project was developed by `React` `Styled Component` & `TypeScript`.

I choose `Material UI` as the design framework. When typing in the search input, it will `debounce` the request of getting the data from API. I also build the code as server-side render files to improve `SEO`. There are two `language` versions provided.

When loading data, it will call API 5 times at once, and sets the data from the API to redux store. Clicking the last page button of the pagination will automatically load data again, and append the new ones into the store. You will find the pagination will be more pages after you click the last page if there is more data to fetch.

---

## Code design

Only 1 page in the APP.

All components are placed in the `components` folder. Actions, reducers, and API fetch functions are located in the `modules` folder.

There is a middleware invented for common single fetch. However, I don't really use it in this project. It will be found in the `middlewares` folder.

Common functions and variables are defined in the `utils` folder.

---

## Activate the APP

- Clone the repo
- `npm install`
- `npm start`
