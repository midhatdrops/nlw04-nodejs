import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyRepositories } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/userRepository';
import SendMailService from '../services/SendMailService';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;
    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveyRepositories);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });
    if (!userAlreadyExists) {
      return res.status(400).json({ error: 'User not found' });
    }

    const surveyAlreadyExists = await surveysRepository.findOne({
      id: survey_id,
    });
    if (!surveyAlreadyExists) {
      return res.status(400).json({ error: 'Survey not found' });
    }

    // Salvar as informações na tabela surveyUser

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: userAlreadyExists.id }, { value: null }],
      relations: ['user', 'survey'],
    });

    const npsPath = path.resolve(
      __dirname,
      '..',
      'views',
      'emails',
      'NPSMail.hbs'
    );

    const surveyUser = surveysUsersRepository.create({
      user_id: userAlreadyExists.id,
      survey_id: surveyAlreadyExists.id,
    });

    const body = {
      name: userAlreadyExists.name,
      title: surveyAlreadyExists.title,
      description: surveyAlreadyExists.description,
      link: process.env.URL_MAIL,
      user_id: userAlreadyExists.id,
    };

    if (surveyUserAlreadyExists) {
      await SendMailService.execute(
        email,
        surveyAlreadyExists.title,
        body,
        npsPath
      );
      return res.json(surveyUserAlreadyExists);
    }

    await surveysUsersRepository.save(surveyUser);

    //Enviar e-mail para o usuário

    await SendMailService.execute(
      email,
      surveyAlreadyExists.title,
      body,
      npsPath
    );

    return res.json(surveyUser);
  }
}

export { SendMailController };
