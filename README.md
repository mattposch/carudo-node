## Setup
- npm i
- create .env file

## Commands
Start service with debugger - via npm run debugServer
Start scheduler with debugger - via npm run debugScheduler
Start production ready build, will start server in cluster

## Conventions
- every module must have an index.ts which provides all necessary exports for the specific module (see messaging module)
- import order (the blocks have to be separated by a blank line)
    - node modules
    - core modules
    - feature modules 
- private attributes and methods must have a "_" prefix

## New Service Class
1.  create Service Class file in service folder
2.  add entry in src/ioc/types.ts
3.  add entry in src/ioc/bootstrap.ts
