import { Router } from 'express';
import 'reflect-metadata';
import { container } from "tsyringe";
import HomeController from '../Controllers/homeController';


class HomeRoutes
{
  router : Router;
  di : HomeController;

  constructor()
  {
    this.router = Router();
    this.di = container.resolve(HomeController);

    this.router.get("/test", this.di.index.bind(this.di));
  }
}

export default new HomeRoutes().router;