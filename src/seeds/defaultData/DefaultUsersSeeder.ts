import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User, UserRole } from '../../entities/User.entity';

const users = [
  {
    id: '11238324-7e2b-11ec-90d6-0242ac120003',
    email: 'manager@example.com',
    password: '123456',
    role: UserRole.MANAGER,
  },
  {
    id: '1123861c-7e2b-11ec-90d6-0242ac120003',
    email: 'user@example.com',
    password: '123456',
    role: UserRole.REGULAR,
  },
];

export default class DefaultUsersSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userRep = await connection.getRepository(User);

    for (const user of users) {
      const u = await userRep.findOne(user.id);
      if (!u) {
        const newUser = await userRep.create(user);
        await userRep.save(newUser);
      }
    }
  }
}
