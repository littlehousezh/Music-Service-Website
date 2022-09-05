# React - 🎵 NetEase Music for PC 🎵

## Introduction
### Tech Stack
Based on `react` + `redux` + `react-router` + `styled-components` + `axios` + `ant design` + `react-redux` + `redux-thunk` `immutable` + `redux-immutable` + `react-transition-group`
A PC "Netease Music PC" web project, UI interface reference PC version of Netease Music with flex layout.

#### Front-end

- `React`: `MVVM` framework for building user interfaces
- `styled-components`: resolves conflicts caused by component content writing styles that affect global styles
- `axios`: sending network requests, request interception and response interception
- `react-router`: a routing system for single-page applications
- `react-router-config`: centralized path mapping table management
- `redux`: React centralized state management, very handy when multiple components share some state
- `react-redux`: helper tool to help us chain `redux` and `react`
- `immutable`: use `immutable` to manage the `state` saved in `reudx`
- `redux-immutable`: management of `state` in `reducer` in the root directory
- `redux-thunk`: asynchronous requests in `redux`
- `propType`: check `props` type and default value
- `react-transition-group`: add transition animation effects
- Optimizations in the project: use `memo` for all functional components, route lazy loading, function anti-shake

#### Back-End

- `Node.js`：Local test server built with `Express
- `axios`：Used to request back-end `API` music data
- [NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/)：NetEase Music `NodeJS` version `API`, providing music data
- Can also use the NetEase connection that has been deployed to the server: http://123.57.176.198:3000/

#### Other tools

- create-react-app：React Scaffolding tools for quick initialization of codes
- eslint：Code style checking tool to help us standardize coding


## Construct Project
- After cloning the code locally, need to run NeteaseCloudMusicApi so as to start a music API interface. (**Optional)**
- If you need to build on a server, you need to put the API on your own server. (**Optional)**
- NetEase Music interface that has been deployed to the server: http://39.102.36.212:3000/ (**Default API**)

``` powershell
# yarn dependencies
yarn install | npm install
 
# serve with hot reload at localhost:3000
yarn satrt  | npm satrt

# build for production with minification
yarn build  |  npm build
```

## Reference

- [coderwhy](https://github.com/coderwhy)
- API: [Binaryify](https://github.com/Binaryify/NeteaseCloudMusicApi)


Thanks~😄
