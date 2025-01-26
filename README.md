## How to run P2P Backend

## Required Modules
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud database)

## Setup and Run

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/p2p_communication_app.git
   cd p2p_communication_app/backend
2. **Install Dependencies:**

   Run the following command to install the required dependencies:

        npm install
4. **Set up Environment Variables:**

   Create a .env file in the root directory and add the following:

         PORT=5000
         MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase
         JWT_SECRET=your_jwt_secret
6. **Start the Server:**

    Run the server using:

         npm start
The backend should now be running on http://localhost:5000 (or the port specified in .env).

This should provide a clear and simple guide for running your P2P backend. After successful run, go to our p2p_app_frontend repo, and run the main app in your computer.

Thanks!
