# Patient-Dashboard
Patient Dashboard - Frontend
This is the frontend for the Acme Corp Patient Dashboard, a web-based application for patients to track their weight-loss progress and medication shipments. The frontend is built with React, Vite, Tailwind CSS, and React Router, providing a responsive UI with secure authentication and data visualization.
Prerequisites
Before setting up the frontend, ensure you have the following installed:

Node.js: v16 or higher
npm: v8 or higher
Git: For cloning the repository
Backend: The backend server (from the backend branch) must be running to provide API data.

Setup Instructions

Clone the Repository and Switch to Frontend Branch
git clone <repository-url>
cd Patient-Dashboard
git checkout frontend


Navigate to Frontend Directory
cd frontend


Install DependenciesInstall the required Node.js packages:
npm install


Configure Environment VariablesCreate a .env file in the frontend directory with the following variable:
VITE_API_URL=http://localhost:5000/api


VITE_API_URL: The base URL of the backend API (default is http://localhost:5000/api).


Run the BackendEnsure the backend server (from the backend branch) is running:
cd ../backend
npm install
npm run dev

See the backend README.md for detailed setup instructions.

Run the FrontendStart the Vite development server:
cd ../frontend
npm run dev

The frontend will run on http://localhost:5173 (or another port if specified). Open this URL in your browser.

Verify the Frontend

Navigate to http://localhost:5173 and register a new user or log in with existing credentials (e.g., john.doe@example.com with password password123 if using the provided MongoDB JSON).
Test the Dashboard, Weight Progress, and Shipments pages to ensure data is displayed.
Use the "Seed Mock Data" button on the Dashboard to populate mock data if needed.



Project Structure

frontend/
src/
components/: Reusable components (Sidebar.jsx, LoadingSpinner.jsx).
context/: Authentication context (AuthContext.js).
data/: Mock data (mockData.js).
pages/: Page components (DashboardPage.jsx, ShipmentsPage.jsx, WeightProgressPage.jsx).
services/: API service modules (authService.js, patientService.js).
App.jsx: Main app component with routing.
index.css: Tailwind CSS styles.


.env: Environment variables (not committed).
tailwind.config.js: Tailwind CSS configuration.
vite.config.js: Vite configuration.



Available Scripts

npm run dev: Starts the Vite development server.
npm run build: Builds the app for production.
npm run preview: Previews the production build locally.

Features

Secure Authentication: Login and registration with JWT-based authentication.
Dashboard Overview: Displays current weight, BMI, progress percentage, and next shipment.
Weight Progress: Visualizes weight history with a line chart (using Chart.js) and allows adding new weight entries.
Shipment Tracking: Lists past and upcoming shipments with a form to add new shipments.
Responsive Sidebar: Navigation for all pages, with a logout button and mobile-friendly toggle.

Notes

The frontend communicates with the backend at http://localhost:5000/api. Ensure the backend is running and VITE_API_URL is correct.
Tailwind CSS is used for styling, and Heroicons provide icons for the sidebar.
Mock data (mockData.js) is used as a fallback if API calls return no data.
For production, optimize the build (npm run build) and serve with a static server (e.g., Nginx).

Troubleshooting

API Errors: Ensure the backend is running and VITE_API_URL matches the backend URL. Check the browser console for errors.
CORS Issues: Verify the backend's FRONTEND_URL matches the frontend's URL (http://localhost:5173).
Chart Issues: Ensure react-chartjs-2 and chart.js are installed correctly.
Navigation Issues: Confirm react-router-dom is installed and routes are set up in App.jsx.

For issues, contact the repository maintainer or check the browser console logs.
