import { Router } from 'express';

const routes = Router();

routes.get('/users', (req, res) =>
  res.json({ message: "'Hello World - NW04'" })
);

routes.post('/users', (req, res) => {
  console.log(req);
  return res.json({ message: 'Dados enviados com sucesso !' });
});
export default routes;
