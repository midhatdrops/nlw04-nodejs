import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import { SurveyRepositories } from '../repositories/SurveysRepository';

class SurveysController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

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
