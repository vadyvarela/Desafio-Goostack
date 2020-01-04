<h1 align="center">
<img src="https://raw.githubusercontent.com/Rocketseat/bootcamp-gostack-desafio-02/master/.github/logo.png">
</h1>
<h3 align="center">
Front-end React.js - GoStack Bootcamp <a href="https://rocketseat.com.br" target="__blank">Rocketseat</a>
</h3>

<p align = "center">
<img alt = "Última confirmação do Github" src="https://img.shields.io/github/last-commit/vadyvarela/Desafio-Goostack">
<img alt = "Idioma principal do GitHub" src="https://img.shields.io/github/languages/top/vadyvarela/Desafio-Goostack">
</p>

# Gympoint
Gym management system

## Funcionalidades admin
Project funcionality:
* User Authentication
* Student Registration
* Plan management
* Enrollment Management

## Funcionalidade estudante
* Student Checkins
* Requests for assistance
	
## Setup Backend
To run this project, install it locally using yarn:

```
# Go into the repository
$ cd backend

# Install the dependencies
$ yarn install

# Edit file ENV.EXAMPLE with your data
$ edit .env.example

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


## Setup Frontend
To run this project, install it locally using yarn:

```
# Go into the repository
$ cd frontend

# Install the dependencies
$ yarn install

# Run the web app
$ yarn start
```

## Setup Mobile
To run this project, install it locally using yarn:

### This application was only tested on android if ios give any error please ignore.

```
# Go into the repository
$ cd mobile

# Install the dependencies
$ yarn install

# Run the mobile app
$ react-native run-android 

# After install just run 
$ yarn start
```


