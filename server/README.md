# Server for My MERN Blog Project

## Overview

This is the server-side of the MERN blog project, built with Express and Node.js. It manages backend logic, API endpoints, authentication, and interactions with MongoDB.

The server integrates the following features:

- **Google APIs**: Used for sending emails. The server interacts with Google APIs for email functionality, leveraging OAuth2 for authentication.
- **node-cache**: Utilized for caching blog data to improve performance by reducing the number of database queries.

## Live Demo

You can view the live demo of the project here: [Demo Link](https://raviranjan-mern-blog-server.vercel.app)

## Prerequisites

Ensure you have the following software installed:

- Node.js (vX.X.X)
- npm (vX.X.X)
- MongoDB (vX.X.X)

## Installation

Follow these steps to set up the server locally:

```bash
# Navigate to the server directory
cd server

# Install server dependencies
npm install
```

## Create a .env file in the server directory with the following content:

NODE_ENV=your-node-environment
PORT=your-port-number
CORS_ORIGIN=your-cors-origin
DATABASE_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=your-jwt-expires
JWT_REFRESH_SECRET=your-jwt-refresh
JWT_REFRESH_EXPIRES_IN=your-jwt-refresh-expires
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
REFRESH_TOKEN=your-refresh-token
EMAIL=your-email-address

## Follow these steps to start the server locally:

```bash
# Start server
npm run dev
```
