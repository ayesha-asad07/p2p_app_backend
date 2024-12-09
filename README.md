# Running the P2P Backend

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud database)

## Setup and Run

1. *Clone the Repository*:
   ```bash
   git clone https://github.com/your-username/p2p_communication_app.git
   cd p2p_communication_app/backend
Install Dependencies: Run the following command to install the required dependencies:

bash
Copy code
npm install
Set up Environment Variables: Create a .env file in the root directory and add the following:

plaintext
Copy code
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase
JWT_SECRET=your_jwt_secret
Start the Server: Run the server using:

bash
Copy code
npm start
The backend should now be running on http://localhost:5000 (or the port specified in .env).

arduino
Copy code

This should provide a clear and simple guide for running your P2P backend.
