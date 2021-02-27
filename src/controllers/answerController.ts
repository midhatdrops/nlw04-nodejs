import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getCustomRepository } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import * as yup from 'yup';

interface decoding {
  id: string;
  expiresIn: string;
}

dotenv.config();

class AnswerController {
  async execute(req: Request, res: Response) {
    const { value } = req.params;
    const { u } = req.query;
    const token = u.toString();
    const validation = {
      value,
      token,
    };

    const schema = yup.object().shape({
      value: yup.string().required(),
      token: yup.string().required(),
    });

    try {
      await schema.validate(validation, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({
        error: err.errors,
      });
    }

    const decoded = await verify(token, process.env.AUTH_SECRET);
    const id = (<decoding>decoded).id;
    console.log(id);

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(id),
    });

    if (!surveyUser) {
      return res.status(400).json({
        error: 'Survey User does not exists!',
      });
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return res.status(200).json(surveyUser);
  }
}

export { AnswerController };
