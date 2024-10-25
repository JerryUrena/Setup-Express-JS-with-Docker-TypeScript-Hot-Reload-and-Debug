import express, { Application } from "express";
import cors, { CorsOptions } from "cors";

import Routes from "./Routes";
import { IResponseModel } from "./Models/responseModel";

/**
 * @name server
 * @see https://expressjs.com/en/starter/hello-world.html
 * @summary This is the implementation of express server, router and cors.
 */
export default class Server 
{
  //Express instance
  app: Application;

  constructor() 
  {
    this.app = express();

    //Config app
    this.config();

    //Configure routes
    new Routes(this.app);
  }


  /**
   * @description setup all the express configurations needed. 
   * @name config
   */
  private config(): void 
  {
    const corsOptions: CorsOptions = {
      credentials: true,
      origin: "*",
      methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.json({ limit: '50mb' }));
  }


  /**
   * @description Starts the server and handle the global errors.
   * @name start
   * @param port number
   */
  public start() : void
  {
    //Assign the proper host and port
    const host : string = process.env.HOST || "0.0.0.0";
    const port : number = process.env.PORT ? Number(process.env.PORT) : 80;
    
    //Log info
    console.log(`Server: ${host}:${port}`);

    //Start listeing
    this.app.listen(port, host);

    //handle errors
    this.app.on('error', (error) =>
    {
      this.ErrorHandler(error);
    });

    //Handle uncaught Exceptions
    this.app.on('uncaughtException', (error) =>
    {
      this.ErrorHandler(error);
    });
  }

  //Handle Error 500
  private ErrorHandler (err : any) : IResponseModel 
  {
    const errorResponse : IResponseModel = {
      message: "Invalid URL or Method",
      status: 500,
      success: false
    };

    //TODO: Handle response error in a better way
    return errorResponse;
  }
}

//Create a new instance of the express server and start it.
new Server().start();