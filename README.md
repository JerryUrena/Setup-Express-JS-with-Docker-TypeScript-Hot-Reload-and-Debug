## Requirements

- **Node.js**: Download and install the latest version of Node.js [here](https://nodejs.org/en/download/package-manager). Verify your installation:
  ```bash
  node --version
  ```

- **Docker**: Download and install the latest version of Docker [here](https://docs.docker.com/get-started/get-docker). Open Docker Desktop and verify that it's running:
  ```bash
  docker info
  ```

- **Visual Studio Code**: Download and install the latest version from [here](https://code.visualstudio.com/).

- **GIT**: Download and install the latest version from [here](https://git-scm.com/downloads).

- **Project Repository**: Clone the initial repository from [here](https://github.com/JerryUrena/Setup-Express-JS-with-Docker-TypeScript-Hot-Reload-and-Debug)
```bash
git clone https://github.com/JerryUrena/Setup-Express-JS-with-Docker-TypeScript-Hot-Reload-and-Debug
```

---

## 1. Initialize the Project

### Initialize Node modules:

This project uses `npm` to manage dependencies. Navigate to your project directory and install the dependencies:
```bash
cd myapp && npm install
```

### Install additional dev dependencies:

To ensure TypeScript definitions are available, install the following dev dependencies:
```bash
npm install -D @types/cors @types/node
```

### Install runtime dependencies:

These dependencies are necessary for Dependency Injection and other features in this project:
```bash
npm install tsyringe cors reflect-metadata
```

---

## 2. Project Structure

Here's a breakdown of the project's structure inside the `src` directory:

```
src/
├── Controllers/
│   └── homeController.ts
├── Models/
│   └── responseModel.ts
├── Routes/
│   ├── homeRoutes.ts
│   └── index.ts
└── index.ts
```

### Explanation:

- **Controllers**: This folder contains the logic that processes incoming requests. For example, `homeController.ts` handles requests for a specific route (e.g., `/test`).
- **Models**: Contains data models, such as `responseModel.ts`, which defines the structure of the responses returned by the API.
- **Routes**: This folder manages the routing of HTTP requests. It delegates requests to the appropriate controllers.
- **index.ts**: The main entry point of the application that initializes Express and configures middleware.

---

## 3. Configure the Project

### 3.1 `src/index.ts`

This is the main entry point of the application. It defines the `Server` class which encapsulates the entire Express configuration, middleware setup, routing, and error handling.

```ts
import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./Routes";
import { IResponseModel } from "./Models/responseModel";

export default class Server {
  app: Application;

  constructor() {
    this.app = express(); // Initialize Express app instance
    this.config();        // Configure app settings
    new Routes(this.app); // Set up routing by initializing the Routes class
  }

  // This method configures middleware like CORS
  private config(): void {
    const corsOptions: CorsOptions = {
      credentials: true,
      origin: "*",         // Allow any origin
      methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] // Allowed HTTP methods
    };
    this.app.use(cors(corsOptions)); // Apply CORS middleware
  }

  // Start the server and set up global error handlers
  public start(): void {
    const host: string = process.env.HOST || "0.0.0.0";
    const port: number = process.env.PORT ? Number(process.env.PORT) : 80;
    console.log(`Server running at ${host}:${port}`);

    this.app.listen(port, host); // Start the Express server

    // Attach global error handling events for server errors
    this.app.on('error', (error) => this.errorHandler(error));
    this.app.on('uncaughtException', (error) => this.errorHandler(error));
  }

  // Custom error handler to return a consistent error response model
  private errorHandler(err: any): IResponseModel {
    return {
      message: "Invalid URL or Method",
      status: 500,
      success: false
    };
  }
}

new Server().start(); // Create a new instance of the server and start it
```

### Explanation:

- **Server Class**: Encapsulates the server setup using OOP. The constructor configures middleware and sets up routes.
- **CORS Configuration**: Allows cross-origin requests by setting headers and configuring allowed HTTP methods.
- **Error Handling**: The `errorHandler` method captures and formats server errors into a standardized response format.

---

### 3.2 `src/Routes/index.ts`

This file is responsible for initializing and managing all the routes in the application. It also handles common error responses, such as returning 404 errors for invalid paths.

```ts
import { Application, Request, Response } from "express";
import { IResponseModel } from '../Models/responseModel';
import HomeRoutes from './homeRoutes';

export default class Routes {
  constructor(app: Application) {
    app.use("/", HomeRoutes); // Register the HomeRoutes for root-level requests

    const errorResponse: IResponseModel = {
      message: "Invalid URL or Method",
      status: 404,
      success: false
    };

    // Handle all unmatched GET requests (404 errors)
    app.get('*', (req: Request, res: Response<IResponseModel>) => {
      res.status(404).json(errorResponse).end();
    });

    // Handle all unmatched POST requests (404 errors)
    app.post('*', (req: Request, res: Response<IResponseModel>) => {
      res.status(404).json(errorResponse).end();
    });
  }
}
```

### Explanation:

- **Route Initialization**: This class is responsible for initializing and registering all the application's routes.
- **Error Handling**: Any request that doesn't match the registered routes will receive a `404` error, returning a response defined by `IResponseModel`.

---

### 3.3 `src/Routes/homeRoutes.ts`

The `HomeRoutes` class defines a specific route (`/test`) and leverages Dependency Injection (DI) to inject the `HomeController` using the `tsyringe` library.

```ts
import { Router } from 'express';
import 'reflect-metadata';
import { container } from "tsyringe";
import HomeController from '../Controllers/homeController';

class HomeRoutes {
  router: Router;
  di: HomeController;

  constructor() {
    this.router = Router();
    this.di = container.resolve(HomeController); // Dependency Injection: resolve HomeController from container

    // Define the /test route and bind the controller method
    this.router.get("/test", this.di.index.bind(this.di));
  }
}

export default new HomeRoutes().router; // Export an instance of the router to be used in the application
```

### Explanation:

- **Dependency Injection**: The `container.resolve(HomeController)` allows the injection of `HomeController` via DI. This makes the class loosely coupled and more testable.
- **Route Definition**: The `/test` route is handled by the `index` method of `HomeController`. The `bind` ensures the method's `this` context remains bound to the controller instance.

---

### 3.4 `src/Controllers/homeController.ts`

This controller handles incoming requests for the `/test` route and sends back a predefined response.

```ts
import { Request, Response } from "express";
import { IResponseModel } from "../Models/responseModel";
import { autoInjectable } from "tsyringe";

@autoInjectable() // Enables automatic Dependency Injection by tsyringe
class HomeController {
  // Handles the GET request for /test route
  public async index(req: Request, res: Response): Promise<void> {
    const response: IResponseModel = {
      message: "Hello there!",
      status: 200,
      success: true
    };
    res.send(response).end(); // Send the response back and end the connection
  }
}

export default HomeController;
```

### Explanation:

- **Controller Logic**: The `HomeController` defines the logic that processes requests to the `/test` route and sends back a JSON response.
- **Dependency Injection**: The `@autoInjectable()` decorator makes the class injectable, allowing it to be resolved by the DI container.

---

### 3.5 `src/Models/responseModel.ts`

This interface defines the structure of the API responses, ensuring consistent response formats across the application.

```ts
export interface IResponseModel {
  success: boolean; // Indicates if the request was successful
  message: any;     // Contains the main message or data
  data?: any;       // Optional: Additional data related to the response
  status: number;   // HTTP status code of the response
}
```

### Explanation:

- **Interface Definition**: This model ensures that all API responses follow a consistent format, with fields for success status, message, optional data, and HTTP status code.

---

## 4. Running the Project

Once you have configured the project, you can run it using Docker. Follow these steps:

- Make sure the Docker desktop app is running.
- Go to terminal / Run Tasks 
- Run the task named: `Build DOCKER Development server and start`

Wait for Docker to finish building the image and then visit [http://localhost/test](http://localhost/test) to access the server.