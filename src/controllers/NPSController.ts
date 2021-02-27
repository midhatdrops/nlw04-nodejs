import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import * as yup from 'yup';

class NPSController {
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params;

    const schema = yup.object().shape({
      survey_id: yup.string().required(),
    });

    try {
      await schema.validate(req.params, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({
        error: error.errors,
      });
    }
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractor = surveysUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    );
    const promoters = surveysUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    );
    const passives = surveysUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    );

    const totalAnswers = surveysUsers.length;

    const calculate = Number(
      (((promoters.length - detractor.length) / totalAnswers) * 100).toFixed(2)
    );

    return res.status(200).json({
      detractors: detractor.length,
      promoters: promoters.length,
      passives: passives.length,
      totalAnswers,
      calculate,
    });
  }
}

export { NPSController };
