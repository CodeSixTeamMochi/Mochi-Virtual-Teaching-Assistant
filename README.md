# Mochi - Virtual Teaching Assistant

👥 The Team
This project was developed by:

Namitha Danupama - [\[GitHub Link\]](https://github.com/NamithaDanupama)

Thewan Jayaweera  - [\[GitHub Link\]](https://github.com/Thewjay)

Sandes Damunugalla- [\[GitHub Link\]](https://github.com/Sandes-Damunu)

Movindu Gamage  - [\[GitHub Link\]](https://github.com/Movindu-Gamage)

Hesandu Disanayaka - [\[GitHub Link\]](https://github.com/Hesanduu)

Punsith Wikramanayaka - [\[GitHub Link\]](https://github.com/PunsithR)

## Project Setup Instructions

If you've been given access to this repository and the `.env` file, please follow these steps to get both the frontend and backend running locally.

### 1. Environment Variables
Before running the application, place the provided `.env` file in the root directory (or inside the `backend/` folder, depending on the agreed-upon configuration).

### 2. Frontend Setup (React/Vite)
You need [Node.js](https://nodejs.org/) installed on your computer.

Open a terminal in the root project folder and run:
```bash
# Install all required React packages
npm install

# Start the frontend development server
npm run dev
```

### 3. Backend Setup (Python/Flask)
You need [Python](https://www.python.org/downloads/) installed on your computer.

Open a **new** terminal window, navigate to the `backend` folder, and run:
```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment (Recommended)
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install all required Python packages
pip install -r requirements.txt

# Start the Flask backend server
python app.py
```