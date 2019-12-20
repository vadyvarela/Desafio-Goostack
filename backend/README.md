<h1 align="center">
<img src="https://raw.githubusercontent.com/Rocketseat/bootcamp-gostack-desafio-02/master/.github/logo.png">
</h1>
<h3 align="center">
Front-end React.js - GoStack Bootcamp <a href="https://rocketseat.com.br" target="__blank">Rocketseat</a>
</h3>

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

``
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



