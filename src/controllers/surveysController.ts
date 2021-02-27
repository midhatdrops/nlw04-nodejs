import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import { SurveyRepositories } from '../repositories/SurveysRepository';
import * as yup from 'yup';

class SurveysController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const schema = yup.object().shape({
      title: yup.string().required(),
      description: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: err.errors,
      });
    }

    const surveysRepository = getCustomRepository(SurveyRepositories);

    const survey = surveysRepository.create({
      title,
      description,
    });

    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }

  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveyRepositories);

    const all = await surveysRepository.find();

    return response.status(200).json(all);
  }
}

export { SurveysController };
