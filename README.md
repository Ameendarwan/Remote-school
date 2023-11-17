<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p>

<h3 align="center">Takmil cluster of backend micro-services</h3>

[![NestJs][nestjs-shield]][ref-nestjs] [![NodeJs][nodejs-shield]][ref-nodejs] [![TypeScript][typescript-shield]][ref-typescript] [![MongoDB][mongodb-shield]][ref-mongodb] [![JWT][jwt-shield]][ref-jwt] [![Jest][jest-shield]][ref-jest] [![Pnpm][pnpm-shield]][ref-pnpm] [![Docker][docker-shield]][ref-docker]



---

<p align="center"> This will be mono-repo containing all services, and shared code among them placed between libs/common folder [to be changed later].
    <br>
</p>

## 📝 Table of Contents
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage-docker)
- [Built Using](#built_using)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🏁 Getting Started <a name = "getting_started"></a>
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
> Make sure to check that the tools have been installed successfully.

1. [NodeJs][ref-nodejs]
2. [MongoDB][ref-mongodb]
3. [Pnpm][ref-pnpm]
4. [Git][ref-git]

### Note

This will provide instructions for setting up project locally without docker, it will follow up, but there are few gotchas to keep in mind, each service have their own enviornment files `.env` and most use same variables name inside their as an example for `PORT`, one workaround is to create global `.env` file for project wishing to setup, but runing multiple apps kinda seems not possible right now, *that's why it's advised to use docker for setting up project locally*.

### Clone Repo

Clone the project with git.

```bash
git clone https://github.com/Teach-a-Kid-Make-Individual-Life/backend.git
```

### Install Dependencies

This project needs some dependencies. Let's go install it.

```bash
pnpm install
```

### Clone environment

`.env` are only picked which are present in global root directory, you can copy `.env` of sub-app you want to run globally as a workaround now.

```bash
cp /path/to/sub/app/.env.example ./.env
```

## 🔧 Running the tests <a name = "tests"></a>

The project only provide `unit testing`, and as of now only auth micro-service unit test has been setup with mocking repository that to be changed later on with in-memory database.

```bash
pnpm run auth:test
```
## 🎈 Usage <a name="usage"></a>

### Run Project

Finally, Cheers 🍻🍻 !!! you passed all steps.

Now you can run the project, name is required for app to run, for instance here it will run auth app in development mode.

Apps that have been built as of now.
- organization
- school
- auth
- curriculum-builder
- attendance
- assessments

```bash
pnpm start:dev auth
```

## 🎈 Setup With Docker <a name="usage-docker"></a>
For docker installation, we need more tools to be installed.

1. [Docker][ref-docker]
2. [Docker-Compose][ref-dockercompose]

After you installation, then run below, this runs it in detached mode

```bash
docker-compose up --build -d
```

## 🚀 Deployment <a name = "deployment"></a>
Add additional notes about how to deploy this on a live system.

## ⛏️ Built Using <a name = "built_using"></a>
- [NestJS][ref-nestjs] - A Node.js framework for building efficient and scalable server-side applications.
- [Node.js][ref-nodejs] - A runtime environment for executing JavaScript code on the server.
- [TypeScript][ref-typescript] - A statically typed superset of JavaScript for enhanced code quality and development experience.
- [MongoDB][ref-mongodb] - A NoSQL database for storing and managing data.
- [JWT][ref-jwt] - JSON Web Tokens for secure authentication and authorization.
- [Jest][ref-jest] - A JavaScript testing framework for unit and integration testing.
- [Docker][ref-docker] - A platform for developing, shipping, and running applications in containers.
- [pnpm][ref-pnpm] - A fast package manager for JavaScript projects.


## ✍️ Authors <a name = "authors"></a>
- [@zakirmagdum](https://github.com/zakirmagdum) - Idea & Initial work
- [@tamirazrab](https://github.com/tamirazrab) - Backend Developer

## 🎉 Acknowledgements <a name = "acknowledgement"></a>
[To be add later]

[takmil-contributors-shield]: https://img.shields.io/github/contributors/Teach-a-Kid-Make-Individual-Life/backend?style=for-the-badge
[takmil-stars-shield]: https://img.shields.io/github/stars/Teach-a-Kid-Make-Individual-Life/backend?style=for-the-badge
[takmil-issues-shield]: https://img.shields.io/github/issues/Teach-a-Kid-Make-Individual-Life/backend?style=for-the-badge
[takmil-license-shield]: https://img.shields.io/github/license/Teach-a-Kid-Make-Individual-Life/backend?style=for-the-badge



[nestjs-shield]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[nodejs-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[mongodb-shield]: https://img.shields.io/badge/MongoDB-white?style=for-the-badge&logo=mongodb&logoColor=4EA94B
[jwt-shield]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white
[jest-shield]: https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white
[pnpm-shield]: https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220
[docker-shield]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[github-shield]: https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white

<!-- Reference -->
[ref-nestjs]: http://nestjs.com
[ref-mongoose]: https://mongoosejs.com
[ref-mongodb]: https://docs.mongodb.com/
[ref-nodejs]: https://nodejs.org/
[ref-typescript]: https://www.typescriptlang.org/
[ref-docker]: https://docs.docker.com
[ref-dockercompose]: https://docs.docker.com/compose/
[ref-pnpm]: https://pnpm.io/
[ref-12factor]: https://12factor.net
[ref-nestjscommand]: https://gitlab.com/aa900031/nestjs-command
[ref-jwt]: https://jwt.io
[ref-jest]: https://jestjs.io/docs/getting-started
[ref-git]: https://git-scm.com
