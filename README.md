# Getting Started

This is an FGPE Learning Platform user interface. This project uses react, typescript, keycloak (auth), react-i18next and emotion / chakra-ui (styling).

You need Node.js installed to run this project.
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Adding translations

This app is using the react-i18next package for internationalization.
You can check its documentation [here](https://react.i18next.com/).

To add new translations, create a new file `public/locales/<language_code>/translation.json`.

Remember to add a new language object to the `SUPPORTED_LANGUAGES` array in `src/i18n/config.ts`.

```
[
    {
        code: "en",
        language: "English"
    }
]
```

The `language` parameter should be in original language, not translated to English. The `code` parameter should be same as the name of the folder inside locales catalog, for instance for German language:

```
[
    {
        code: "en",
        language: "English"
    },
    {
        code: "de",
        language: "Deutsch"
    }
]
```

```
public/locales/de/translation.json
```

Language Modal is using this array to display all available languages to the user.

Remember to build the app after adding new translations.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Compiles and minifies for production with Docker

```
docker build -t fgpe/learning-platform:latest .
```

### Serves for production with Docker

```
docker run -it -p 8080:80 \
    -v $(pwd)/docker/nginx.conf:/etc/nginx/nginx.conf \
    --rm fgpe/learning-platform:latest
```
