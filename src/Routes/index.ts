import { Application, Request, Response } from "express";
import { IResponseModel } from '../Models/responseModel';
import HomeRoutes from './homeRoutes';

/**
 * @summary this is the entry point of the express router.
 * You may declare any new route here.
 * @see https://expressjs.com/en/5x/api.html#router
 */
export default class Routes 
{
  constructor(app: Application)
  {
    //Route group
    app.use("/", HomeRoutes);
   

    //Handle Error 404
    const errorResponse : IResponseModel = {
      message: "Invalid URL or Method",
      status: 404,
      success: false
    };

    //Handle Error 404 GET
    app.get('*', (req : Request, res : Response<IResponseModel>) =>
    {
      res.status(404).json(errorResponse).end();
    });

    //Handle Error 404 POST
    app.post('*', (req : Request, res : Response<IResponseModel>) =>
    {
      res.status(404).json(errorResponse).end();
    });
  }
}