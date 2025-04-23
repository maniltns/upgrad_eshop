# upGrad E-Shop

A full-featured e-commerce Single Page Application built with React, Material-UI, and REST API integration.

## Features

- User authentication (Login/Signup)
- Product browsing with category filters and sorting
- Product search functionality
- Shopping cart management
- Order placement with address management
- Admin features for product management
- Responsive Material-UI design

## Tech Stack

- React 18
- React Router DOM 6
- Material-UI 5
- REST API integration
- JWT authentication

## Prerequisites

- Node.js 16+ and npm
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd upgrad-eshop
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
REACT_APP_API_URL=https://dev-project-ecommerce.upgrad.dev/api
```

4. Start the development server:
```bash
npm start
```

5. For production build:
```bash
npm run build
serve -s build
```

## Project Structure

```
upgrad-eshop/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── assets/
│   │   ├── common/
│   │   │   ├── auth.js
│   │   │   ├── api.js
│   │   │   └── utils.js
│   │   ├── components/
│   │   │   ├── Login/
│   │   │   ├── Signup/
│   │   │   ├── Products/
│   │   │   ├── ProductDetails/
│   │   │   ├── CreateOrder/
│   │   │   └── Admin/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL

## API Documentation

The application consumes REST API endpoints from:
https://dev-project-ecommerce.upgrad.dev/api/

Key endpoints:
- `/auth` - Authentication
- `/users` - User management
- `/products` - Product operations
- `/orders` - Order management
- `/addresses` - Address management

## Contributing

1. Create a feature branch
2. Commit changes with descriptive messages
3. Push to the branch
4. Create a Pull Request

## License

MIT
