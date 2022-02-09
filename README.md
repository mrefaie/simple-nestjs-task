## Tech

This simple API is created using:
[Nest](https://github.com/nestjs/nest) framework.

## Get Started

- Clone Repo
- Create .env.dev file in the project root with the following contents:

```
NODE_ENV=development
APP_NAME="NestjsSimpleTask"
APP_PORT_EXPOSED=3333
APP_PORT=3000
WORKER_PORT=3000
DB_HOST=NestjsSimpleTask_mysql_container
DB_USER=NESTJS
DB_PASSWORD=NESTJS@123456
DB_NAME=SimpleTaskDB

TYPEORM_ENTITIES=**/*.entity{.ts|.js}
TYPEORM_SEEDING_SEEDS=**/seeds/**/*{.ts|.js}

JWT_SIGN_SECRET=@@@@
JWT_EXPIRY_IN_SECONDS=3600

REDIS_HOST=NestjsSimpleTask_redis_container
REDIS_PORT=6379

MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=xxx
MAIL_PASSWORD=xxx
MAIL_FROM_NAME=Test
MAIL_FROM_EMAIL=example@email.com
```

> Just put your mailtrap values for `MAIL_USER` and `MAIL_PASSWORD` and please keep the same port for mailtrap to work

- Run the project using the following command:

```bash
docker-compose --env-file .env.dev up
```

- Check the API documentation at: `http://localhost:3333/api`
- Finally use the following one of the following credentials to login:

```
// Manager Account
email: manager@example.com
password: 123456

// Regular Account
email: user@example.com
password: 123456
```

> Make sure you have docker latest version installed

## Testing

To run the unit tests use the following commands:

```bash
docker build --build-arg NODE_ENV=test -t simple_api_app .
docker run simple_api_app npm run test
```

## Roadmap

| Task                                   | Completed Percentage |
| -------------------------------------- | -------------------- |
| Setupup Framework and Dependencies     | 100%                 |
| Write DB Migrations                    | 100%                 |
| Configure Entities and DB Repositories | 100%                 |
| Create User Authentication             | 100%                 |
| Users API Endpoints                    | 100%                 |
| Jobs API Endpoints                     | 100%                 |
| Users Authorization                    | 100%                 |
| Decoupled Notifications                | 100%                 |
| Unit Testing                           | 70%                  |
| E2E Testing                            | 0%                   |
| API Security                           | 50%                  |
| API Throttling                         | 0%                   |
| API Pagination                         | 0%                   |
| Dockerized Development Environment     | 100%                 |
| Kubernetes Deployment Script           | 0%                   |
| Documentation                          | 20%                  |
| Scalability                            | 90%                  |
