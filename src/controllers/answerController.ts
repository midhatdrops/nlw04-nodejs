import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getCustomRepository } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

interface decoding {
  id: string;
  expiresIn: string;
}

dotenv.config();

class AnswerController {
  async execute(req: Request, res: Response) {
    const { value } = req.params;
    const { u } = req.query;
    const id = String(u);

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: id,
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
