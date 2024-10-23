import { Request, Response } from "express";
import { IResponseModel } from "src/Models/responseModel";
import { autoInjectable } from "tsyringe";

@autoInjectable()
class HomeController 
{
  
  public async index(req: Request, res: Response) : Promise<void>
  {
    const response : IResponseModel = {
      message: "hello there",
      status: 200,
      success: true
    }

    res.send(response).end();
  }
}

export default HomeController;