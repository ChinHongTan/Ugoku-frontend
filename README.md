# Ugoku-frontend

A dashboard for [Ugoku-v2](https://github.com/ChinHongTan/Ugoku-v2) written with Vue! This project is still under development, so do not expect anything here to work on your device.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### To-Do List

- [ ] Make the player (play/pause, skip, loop, seek) work with discord bot
- [ ] UI Improvements
- [ ] Have fun with my crazy ideas
- Refactor the codebase
- [ ] FloatingPlayerControl
  - [x] AlbumCover.vue
  - [x] ControlButtons.vue
  - [x] DefaultAlbumCover.vue
  - [ ] FloatingPlayerControl.vue
  - [x] PlayPauseButton.vue
  - [x] ProgressBar.vue
  - [x] QueueToggleButton.vue
  - [x] SongInfo.vue
  - [ ] VolumeControl.vue
  - [ ] LoopButton.vue
- [ ] RightSidebar
  - [ ] History.vue
  - [ ] Queue.vue
- [ ] LeftSidebar
- [ ] Add more tests
