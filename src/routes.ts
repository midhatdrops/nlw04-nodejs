import { Router } from 'express';
import { SendMailController } from './controllers/sendMailController';
import { SurveysController } from './controllers/surveysController';
import { UserController } from './controllers/userController';
const userController = new UserController();
const surveyController = new SurveysController();
const sendMailController = new SendMailController();

const routes = Router();

routes.get('/users', (req, res) =>
  res.json({ message: "'Hello World - NW04'" })
);

routes.post('/users', (req, res) => {
  userController.create(req, res);
});

routes.post('/surveys', (req, res) => {
  surveyController.create(req, res);
});

routes.post('/sendmail', sendMailController.execute);

routes.get('/surveys', surveyController.show);

export default routes;
