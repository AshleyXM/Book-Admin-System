# Book-Admin-System

## Frontend

The project utilizes **Next.js** + **React.js** + **Ant Design** as the front-end tech stack.

## Backend

The project utilizes **Node.js** + **MongoDB** as the back-end tech stack.

## Authentication

**JWT** was used to optimize the authentication. Except the *login* request, every request is sent with an "Authorization" header to the server side. Only requests with correct token value set in the "Authorization" parameter will be responded. Otherwise, the page will be redirected to the *login* page.

## How to Setup

In order to run this project, you need to setup the front-end and back-end environment. Here are the commands:

```powershell
cd book-admin-react
npm install
cd ../book-admin-express
npm install
```

## How to Run

You need to open two terminals to run the frontend and backend respectively.

### Run frontend

```powershell
cd book-admin-react
npm run dev
```

### Run backend

```powershell
cd book-admin-express
npm start
```

Then you can check out http://localhost:3000 to access the project.