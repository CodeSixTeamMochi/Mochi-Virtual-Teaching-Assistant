🚀 Mochi VTA – React Frontend Setup 📌 Project Overview

Mochi VTA (Virtual Teaching Assistant) is a web-based educational platform designed to support pre-school learning through interactive and AI-assisted features. This repository contains the React frontend of the Mochi VTA system, responsible for user interaction, UI rendering, and communication with backend services.

🛠️ Technologies Used

React (Frontend library)

Node.js & npm (Runtime and package manager)

JavaScript (ES6+)

HTML5 & CSS3

Git (Version control)

📂 Project Initialization & Setup

Follow the steps below to initialize and run the Mochi VTA React application locally.

1️⃣ Prerequisites

Ensure the following are installed on your system:

Node.js (v16 or above recommended)

npm (comes with Node.js)

Git

You can verify installations using:

node -v npm -v git --version

2️⃣ Create the React Application

The project was initialized using Create React App:

npx create-react-app mochi-vta

Navigate into the project directory:

cd mochi-vta

3️⃣ Install Dependencies

After navigating into the project folder, install required dependencies:

npm install

(Additional libraries can be added later based on project requirements.)

4️⃣ Start the Development Server

Run the application in development mode:

npm start

The app will be available at:

http://localhost:3000

📁 Project Structure (Initial) mochi-vta/ │── node_modules/ │── public/ │── src/ │ ├── components/ │ ├── pages/ │ ├── assets/ │ ├── App.js │ ├── index.js │── package.json │── README.md

🔧 Available Scripts

npm start – Runs the app in development mode

npm run build – Builds the app for production

npm test – Runs tests

npm run eject – Ejects configuration (not recommended unless necessary)

📌 Notes

This frontend will later integrate with backend services (Django / API services).

UI components are designed to be responsive and child-friendly.

Future enhancements include AI-powered pronunciation correction, visual learning aids, and teacher dashboards.
```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
