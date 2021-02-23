import { Router } from 'express';
import { UserController } from './controllers/userController';
const userController = new UserController();

const routes = Router();

routes.get('/users', (req, res) =>
  res.json({ message: "'Hello World - NW04'" })
);

routes.post('/users', (req, res) => {
  userController.create(req, res);
});
export default routes;
