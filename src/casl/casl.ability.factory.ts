import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Job } from '../entities/Job.entity';
import { User, UserRole } from '../entities/User.entity';
import { Action } from './casl.actions';

type Subjects = InferSubjects<typeof Job> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role === UserRole.MANAGER) {
      can(Action.MANAGE, 'all');
    }

    type FlatJob = Job & {
      'user.id': Job['user']['id'];
    };

    can<FlatJob>(Action.MANAGE, Job, { 'user.id': user.id });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
