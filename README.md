This project gives you a clean setup for an Express.js server using TypeScript and Docker, with hot-reloading and easy debugging. It ensures everything runs consistently across different environments and platforms.
#
#

## Requirements

- Install the latest version of Node.js from [here](https://nodejs.org/en/download/package-manager).
- Verify the installation with:
  ```bash
  node --version
  ```

- Install the latest version of Docker from [here](https://docs.docker.com/get-started/get-docker).
- Open Docker Desktop and verify that it's running.
- Verify that Docker is ready with:
```bash
docker info
```

- Install the lastest version of Visual studio code from [here](https://code.visualstudio.com/)

---

## 1. Initialize the Project

 **Create a project directory**:
   ```bash
   mkdir myapp && cd myapp
   ```

**Initialize Node.js**:
   ```bash
   npm init -y
   ```

---

## 2. Install Dependencies

**Install Express**:
   ```bash
   npm install express
   ```

**Install Dev Dependencies**:
   ```bash
   npm install -D @types/express typescript nodemon ts-node rimraf
   ```

---

## 3. Configure TypeScript

**Initialize TypeScript configuration**:
   ```bash
   npx tsc --init
   ```

**Update `tsconfig.json`**:
   ```json
   {
     "include": [
       "./src/**/*.ts",
       "./src/**/*.js"
     ],
     "compilerOptions": {
       "baseUrl": ".",
       "outDir": "build",
       "rootDir": "src",
       "target": "es6",
       "module": "commonjs",
       "lib": ["es6"],
       "allowJs": false,
       "strict": true,
       "noImplicitAny": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "removeComments": true,
       "resolveJsonModule": true,
       "forceConsistentCasingInFileNames": true,
       "experimentalDecorators": true,
       "emitDecoratorMetadata": true
     },
     "exclude": [
       "node_modules/*"
     ]
   }
   ```

---

## 4. Setup Express

**Create the project structure**:
   ```bash
   mkdir src
   ```

**Create a basic Express server**:
- Inside the src directory create an `index.ts` file and add the following code.
   ```ts
   import express, { Request, Response } from 'express';

   const app = express();
   const PORT = process.env.PORT || 3000;

   app.get('/', (req: Request, res: Response) => {
     res.send('Hello from Express and TypeScript!').end();
   });

   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });
   ```

---

## 5. Set Up Development Environment

**Create the `development` directory**:
   ```bash
   mkdir development
   ```

### 5.1 Nodemon Configuration

**Create `nodemon.json`**:
Create a file `nodemon.json` inside the development folder and add the following code:
   ```json
   {
     "verbose": true,
     "restartable": "rs",
     "legacyWatch": true,
     "ignore": [".git", "node_modules", "build", "development"],
     "watch": ["src"],
     "execMap": {
       "ts": "node -r ts-node/register"
     },
     "ext": "ts,js"
   }
   ```

### 5.2 TypeScript Development Config

**Create `dev.tsconfig.json`**:
Create a file `dev.tsconfig.json` inside the development folder and add the following code:
   ```json
   {
     "extends": "../tsconfig",
     "compileOnSave": true,
     "compilerOptions": {
       "sourceMap": true,
       "strictNullChecks": true
     }
   }
   ```

### 5.3 Environment Variables

**Create `.env`**:
Create a file `.env` inside the development folder and add the following code:
   ```text
   # General envs
   APP_NAME=Example
   PORT=80
   PRODUCTION=0
   APP_VERSION=1.0.0
   ```

---

## 6. Docker Setup

**Create the Dockerfile for development**:
Create a file `dev.Dockerfile` inside the development folder and add the following code:

   ```Dockerfile
   # Stage 1: Build
   FROM node:23

   WORKDIR /home/src/app

   COPY package*.json .

   RUN npm install

   COPY tsconfig.json .
   COPY development/nodemon.json ./development/nodemon.json
   COPY development/dev.tsconfig.json ./development/dev.tsconfig.json
   ```

**Create Docker Compose for development**:
Create a file `dev.docker-compose.yml` inside the development folder and add the following code:
   ```yaml
   services:
     server:
       build:
         context: ../
         dockerfile: development/dev.Dockerfile
       container_name: "${APP_NAME}-${APP_VERSION}"
       volumes:
         - ../src:/home/src/app/src
       restart: always
       environment:
         PORT: "80"
       ports:
         - "9229:9229" # Debugger port
         - "${PORT}:80"
       command: npm run startDockerDev
   ```

---

## 7. Update Scripts in `package.json`

**Replace default scripts**:
   ```json
   {
     "buildDev": "rimraf build && tsc -p development/dev.tsconfig.json",
     "startDev": "rimraf build && tsc -p development/dev.tsconfig.json && nodemon --config development/nodemon.json --inspect src/index.ts",
     "buildAndStartDev": "npm run buildDev && npm run startDev",
     "buildProd": "rimraf build && tsc -p .",
     "startProd": "node build/index.js",
     "buildAndStartProd": "npm run buildProd && npm run startProd",
     "startDockerDev": "nodemon --config development/nodemon.json --inspect=0.0.0.0:9229 src/index.ts"
   }
   ```

---

## 8. Debugging Setup
- Create a new directory: `.vscode` in the root directory

**Configure VS Code Debugging**:
Create a file `launch.json` inside the .vscode folder and add the following code:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug DOCKER server",
         "type": "node",
         "restart": true,
         "request": "attach",
         "port": 9229,
         "address": "127.0.0.1",
         "remoteRoot": "/home/src/app/src",
         "localRoot": "${workspaceFolder}/src"
       }
     ]
   }
   ```

---

## 9. Visual Studio Code Tasks

**Create VS Code tasks**:
Create a file `tasks.json` inside the .vscode folder and add the following code:

```json
  {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "Start DOCKER Development server",
        "type": "shell",
        "command": "docker-compose -f ${workspaceFolder}/development/dev.docker-compose.yml up -d"
      },
      {
        "label": "Stop DOCKER Development server",
        "type": "shell",
        "command": "docker-compose -f ${workspaceFolder}/development/dev.docker-compose.yml down"
      },
      {
        "label": "Build DOCKER Development server",
        "type": "shell",
        "command": "docker-compose -f ${workspaceFolder}/development/dev.docker-compose.yml build"
      },
      {
        "label": "Build DOCKER Development server and start",
        "type": "shell",
        "command": "docker-compose -f ${workspaceFolder}/development/dev.docker-compose.yml up --build -d"
      },
      {
        "label": "DELETE DOCKER CACHE",
        "type": "shell",
        "command": "docker system prune -a -f"
      },
      {
        "label": "Re-build and start DOCKER Development server",
        "type": "shell",
        "command": "docker-compose -f ${workspaceFolder}/development/dev.docker-compose.yml down; docker-compose -f ${workspaceFolder}/development/dev.docker-compose.yml up --build -d"
    }
	]
}
```

---

## 10. Running the Project
If you made it this far then your project is successfully configured and ready to be tested.

**Build and Start**:
   - In Visual Studio Code, open terminal/tasks and run the task named: `Build DOCKER Development server and start`
   - Wait for the docker-compose image to finish building.
   - Visit the server at: [http://localhost](http://localhost)


## 11. Repository
- Clone this repo
```bash
git clone https://github.com/JerryUrena/Setup-Express-JS-with-Docker-TypeScript-Hot-Reload-and-Debug
```
#
- Found an error? [Edit this Repository on GitHub](https://github.com/JerryUrena/Setup-Express-JS-with-Docker-TypeScript-Hot-Reload-and-Debug)
