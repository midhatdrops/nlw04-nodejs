import { EntityRepository, Repository } from 'typeorm';
import { Surveys } from '../models/Surveys';

@EntityRepository(Surveys)
class SurveyRepositories extends Repository<Surveys> {}

export { SurveyRepositories };
