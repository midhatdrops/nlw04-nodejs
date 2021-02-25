import { EntityRepository, Repository } from 'typeorm';
import { SurveyUser } from '../models/SurveysUser';

@EntityRepository(SurveyUser)
class SurveysUsersRepository extends Repository<SurveyUser> {}

export { SurveysUsersRepository };
