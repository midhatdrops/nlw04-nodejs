import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyRepositories } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/userRepository';
import SendMailService from '../services/SendMailService';
import path from 'path';
import dotenv from 'dotenv';
import { sign } from 'jsonwebtoken';

import * as yup from 'yup';

dotenv.config();

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const schema = yup.object().shape({
      email: yup.string().required(),
      survey_id: yup.string().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({
        error: err.errors,
      });
    }

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

    const surveyUser = surveysUsersRepository.create({
      user_id: userAlreadyExists.id,
      survey_id: surveyAlreadyExists.id,
    });

    await surveysUsersRepository.save(surveyUser);

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: userAlreadyExists.id }, { value: null }],
      relations: ['user', 'survey'],
    });

    //jwt
    //prettier-ignore

    const npsPath = path.resolve(
      __dirname,
      '..',
      'views',
      'emails',
      'NPSMail.hbs'
    );

    const token = await sign(
      {
        id: surveyUserAlreadyExists.id,
      },
      process.env.AUTH_SECRET,
      {
        expiresIn: '1d',
      }
    );

    const body = {
      name: userAlreadyExists.name,
      title: surveyAlreadyExists.title,
      description: surveyAlreadyExists.description,
      link: process.env.URL_MAIL,
      user_token: token,
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
