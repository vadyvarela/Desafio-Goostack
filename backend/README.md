<h1 align="center">
<img src="https://raw.githubusercontent.com/Rocketseat/bootcamp-gostack-desafio-02/master/.github/logo.png">
</h1>
<h3 align="center">
Front-end React.js - GoStack Bootcamp <a href="https://rocketseat.com.br" target="__blank">Rocketseat</a>
</h3>

<p align = "center">
<img alt = "Última confirmação do Github" src="https://img.shields.io/github/last-commit/vadyvarela/Desafio-Goostack/tree/master/backend">
<img alt = "Idioma principal do GitHub" src="https://img.shields.io/github/languages/top/vadyvarela/Desafio-Goostack/tree/master/backend">
<img alt = "GitHub" src = "https://img.shields.io/github/license/vadyvarela/gympoint-frontend.svg">
</p>

# Gympoint
Gym management system

## Technologies APIs and Libraries used in this project
* [Express](https://expressjs.com/)
* [Node js](https://nodejs.org/)
* [Mysql2](https://github.com/sidorares/node-mysql2#readme)
* [Json Web Token](https://jwt.io/)
* [Node Mailer](https://nodemailer.com/about/)
* [Bee Queue](https://bee-queue.com/)
* [Dot Env](https://github.com/motdotla/dotenv#readme)
* [Bcrypt](https://github.com/dcodeIO/bcrypt.js/)
* [data fns](https://date-fns.org/)


## Funcionalidades
Project funcionality:
* User Authentication
* Student Registration
* Plan management
* Enrollment Management
* Student Checkins
* Requests for assistance
	
## Setup
To run this project, install it locally using yarn:

```
# Clone this repository
$ git clone https://github.com/vadyvarela/Gympoint.git gympoint-backend

# Go into the repository
$ cd Gympoint

#Run you database MYSQL OR POSTGRES

# Create a new database named `gynpoint` and run the following commands:
# Run Migrations and Seeds
$ yarn sequelize db:migrate
$ yarn sequelize db:seed:all

# Run Nodemailer
$ yarn queue

# Run the Server
$ yarn dev
```

## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.


