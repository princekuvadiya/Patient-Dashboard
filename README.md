# Patient-Dashboard
Patient Dashboard - Backend
This is the backend for the Acme Corp Patient Dashboard, a web-based application for managing patient weight-loss progress and medication shipments. The backend is built with Node.js, Express, and MongoDB, providing RESTful APIs for user authentication, weight tracking, and shipment management.
Prerequisites
Before setting up the backend, ensure you have the following installed:

Node.js: v16 or higher
npm: v8 or higher
MongoDB: A local or cloud-based MongoDB instance (e.g., MongoDB Atlas)
Git: For cloning the repository

Setup Instructions

Clone the Repository and Switch to Backend Branch
git clone <repository-url>
cd Patient-Dashboard
git checkout backend


Navigate to Backend Directory
cd backend


Install DependenciesInstall the required Node.js packages:
npm install


Configure Environment VariablesCreate a .env file in the backend directory with the following variables:
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development


MONGO_URI: Your MongoDB connection string (e.g., mongodb://localhost:27017/patient_dashboard or a MongoDB Atlas URI).
JWT_SECRET: A secure string for signing JWT tokens (e.g., a random 32-character string).
FRONTEND_URL: The URL where the frontend runs (default is http://localhost:5173 for Vite).


Start MongoDBEnsure your MongoDB instance is running:

For a local instance:mongod


For MongoDB Atlas, ensure your IP is allowlisted and the cluster is active.


Run the BackendStart the Express server in development mode:
npm run dev

This uses nodemon to automatically restart the server on code changes. The server will run on http://localhost:5000.

Verify the BackendTest the API using a tool like Postman or curl:

Register a user:curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123","initialWeight":100,"goalWeight":80,"height":170}'

Response: { "token": "<jwt-token>" }
Log in:curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"john@example.com","password":"password123"}'

Response: { "token": "<jwt-token>" }



Project Structure

backend/
config/: Database connection setup (db.js).
controllers/: API logic (authController.js, patientController.js).
middleware/: Authentication and validation (auth.js, validate.js).
models/: Mongoose schemas (User.js, WeightEntry.js, Medication.js, Shipment.js).
routes/: API routes (auth.js, patient.js).
utils/: Error handling utilities (errorResponse.js).
server.js: Entry point for the Express server.
.env: Environment variables (not committed).



Available Scripts

npm run dev: Starts the server with nodemon for development.
npm start: Starts the server in production mode.
npm test: Placeholder for tests (not implemented).

API Endpoints

Authentication:
POST /api/auth/register: Register a new user.
POST /api/auth/login: Log in and receive a JWT token.
GET /api/auth/me: Get authenticated user's profile (requires JWT).


Patient Data:
GET /api/patient/weight: Get weight history.
POST /api/patient/weight: Add a weight entry.
GET /api/patient/shipments: Get shipment history.
POST /api/patient/shipments: Add a shipment.
POST /api/patient/seed: Seed mock data for testing.
POST /api/patient/profile: Get user profile.
POST /api/patient/weight-history: Get weight history (POST version).
POST /api/patient/shipments-list: Get shipments (POST version).



Notes

The backend expects the frontend to run on http://localhost:5173 for CORS. Update FRONTEND_URL in .env if the frontend runs on a different port.
Use MongoDB Compass or the mongo shell to inspect the users collection in the database.
For production, secure the .env file and use a reverse proxy (e.g., Nginx) with HTTPS.

Troubleshooting

MongoDB Connection Error: Ensure MONGO_URI is correct and MongoDB is running. Check network access for MongoDB Atlas.
CORS Issues: Verify FRONTEND_URL matches the frontend's URL.
JWT Errors: Ensure JWT_SECRET is set and consistent across requests.

For issues, contact the repository maintainer or check the logs in the terminal.
