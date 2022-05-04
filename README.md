# Task Manager - Frontend

## Overview

Allows a user to login (via [Auth0](https://auth0.com/)) and manage a list of tasks to be completed.

This repository contains the frontend for the app which is built on Angular. Authentication is managed through [Auth0](https://auth0.com/).

To view the backend repository you can follow this [link](https://github.com/asmillie/task-manager-backend).

<br>

## Live Demo

View a live demo running @ [https://task-manager-frontend-dev.azurewebsites.net/](https://task-manager-frontend-dev.azurewebsites.net/)

_Please note the app is currently deployed on the Azure free tier and may take a moment for the app to 'warm up'. Free tier services are 'parked' when not in continuous use to save on resources._

<br>

## Requirements

The backend for the Task Manager is required to connect to and can be found at [this repository](https://github.com/asmillie/task-manager-backend). The included readme file contains everything necessary to get the backend up and running.

Build the frontend as a docker image through the included `Dockerfile` or run it in a NodeJS environment (**v12.22.8** used in development).

You will also need an [Auth0](https://auth0.com/) account as the app uses [Auth0](https://auth0.com/) for authenticating requests to the api. The basic free account is enough for testing or development purposes. 

*Please see the **Auth0 Setup**, **Configuration** and **Run the Project** sections below for detailed instructions on setup and deployment.*

<br>

## Installation

```bash
git clone https://github.com/asmillie/task-manager-frontend.git
```

<br>

## Auth0 Setup

As stated in the requirements an [Auth0](https://auth0.com/) account is required to run the project. The basic free account should be enough for testing or development purposes. For official documentation please see [https://auth0.com/docs](https://auth0.com/docs).

The following section will outline the steps to complete setup within the Auth0 dashboard before running the project:

1. Create SPA Application
2. Copy Domain & Client ID for Configuration

### 1. Create SPA Application

In the Auth0 Dashboard under Applications->Applications, click **Create Application**. Enter a name and select the **Single Page Web Applications** type and click **Create**.

Select the **Settings** tab and scroll down to the **Application URIs** section. 

Under **Application URIs** are a some inputs that control where the user is redirected after authenticating or logging out through the [Auth0 Universal Login](https://auth0.com/docs/authenticate/login/auth0-universal-login). The required fields for this application are **Allowed Callback URLs**, **Allowed Logout URLs** and **Allowed Web Origins**.

The following show a typical setup for running the app locally using the default ports:

`Allowed Callback URLs`
```
http://localhost:4200, http://localhost:4200/tasks, http://localhost:8080/tasks
```

`Allowed Logout URLs`
```
http://localhost:4200, http://localhost:8080/
```

`Allowed Web Origins`
```
http://localhost:4200, http://localhost:8080/
```

With this done scroll back up to the top of the page to the **Basic Information** section for step 2.

### 2. Copy Domain & Client ID for Configuration

In the **Basic Information** section of the settings tab are the **Domain** and **Client ID** which will be needed for configuring the app.

<br>

## Configuration

To set the required environment variables locate the `environments` folder under `~/src/app/`. Create two files, `environment.ts` for development and `environment.prod.ts` for production. If intending to build and run the app through Docker the production environment will be used. 

Here are the contents of each file to start with:

`environment.ts`
```bash
export const environment = {
  production: false,
  auth0: {
    domain: '',
    clientId: '',
    redirectUri: 'http://localhost:4200/tasks'
  },
  taskApi: {
      url: 'http://localhost:3000',
  }
};
```

`environment.prod.ts`
```bash
export const environment = {
  production: true,
  auth0: {
    domain: '',
    clientId: '',
    redirectUri: 'http://localhost:8080/tasks'
  },
  taskApi: {
      url: 'http://localhost:3000',
  }
};
```

With the files created as shown above it just remains to set the variables that will point the app to your Auth0 account as set during **Auth0 Setup** and to the **Task Manager Backend**.

- `domain` and `clientId` are found in the Auth0 Dashboard under the settings for the Application created during **Auth0 Setup** (See Step 2).

- `redirectUri` must be in the list of Allowed Callback URLs as mentioned during step 1 of the **Auth0 Setup**.

- `taskApi.url` is the URL that the Task Manager Backend is running on. If running with the default setup then it should be running on localhost on port 3000.

<br>

## Run the Project

### **Docker**

```bash
# Build Angular App
ng build --prod
# Build Docker Image
docker build -t task-manager-frontend:latest .
# Run in Docker Container on Port 80
docker run -p 80:80 --name "task_manager-frontend" -d task-manager-frontend:latest
```

### **Development**

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```bash
ng serve
```

### **Production**

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
```bash
ng build --prod
```

## Running unit tests

Execute the unit tests via [Jest](https://jestjs.io/):

```bash
npm run test
```
