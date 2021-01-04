# Renamer

Renamer is a tool you can use to bulk rename files. Renaming is done in steps, and you can add as many steps as you want and re-order them in any way.

There are currently four types of steps
- Replace - A simple string/regex replacement
- Replace List - A list of string/regex replacements
- Change Case - Change to upper/lower/title case
- Trim - Trim any characters off the start/end of the name

More steps will be added in the future.

## Screenshots

<img src="/public/screenshots/main-screen.png" title="Main Screen" width="300">
<img src="/public/screenshots/edit-step.png" title="Edit Step Screen" width="300">

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run electron:build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
