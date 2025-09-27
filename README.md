# Cloud Resource Rental Platform (Mockup)

This project is a full-stack web application designed to simulate a cloud resource rental service. Users can browse and request virtual machines (VMs) or GPU instances, while an administrator manages the available configurations and user requests.

This is a mockup system built for an academic assignment. The application does not provision real cloud resources but mimics the reservation and management workflow.

---

## Technologies Used

| Area          | Technology / Library                               |
| :--------     | :------------------------------------------------- |
| **Frontend**  | React, React Router                                |
| **Backend**   | Node.js, Express.js                                |
| **Database**  | MongoDB with Mongoose                              |
| **Testing**   | Vitest, React Testing Library (to be implemented)  |
| **Styling**   | CSS                                                |

---

## Features & Functional Requirements

The system supports two distinct user roles with specific permissions. Access to all features requires user authentication.

#### **Simple User**
- Can register for a new account and log in.
- Can view the catalog of available VM and GPU configurations.
- Can view the detailed specifications (vCPUs, RAM, Storage, GPU Model) of each configuration.
- Can view a personal dashboard listing their active and pending rental requests.
- Can create a new rental request for a specific resource configuration.
- Can update the details of a pending request.
- Can cancel a pending or active rental request.

#### **Administrator**
- Can add new VM/GPU configurations to the system catalog.
- Can update the specifications of existing configurations.
- Can change the status of a configuration (e.g., `published`, `draft`).
- Can view all rental requests from all users.
- Can approve or reject pending rental requests.
- Can manually terminate an active rental.

---

## Non-Functional Requirements

- **Authentication:** The system must secure endpoints and differentiate between user roles.
- **Responsive Design:** The user interface must be fully responsive and adapt to various screen sizes, from mobile to desktop.
- **Unit Testing:** Core application functionality must be validated with unit tests.

---

## Local Setup & Installation

Follow these instructions to run the project on your local machine.

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a connection string from MongoDB Atlas.

### **1. Clone the Repository**
```bash
git clone <your-repository-url>
cd <your-project-folder>

### 2. Backend Setup

# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file in the /server directory
# and add the following variables:
PORT=5001
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_super_secret_jwt_key>

# Start the backend server
npm start

### 3. Frontend Setup
# Navigate to the client directory from the root folder
cd client

# Install dependencies
npm install


# Start the React development server
npm run dev

The client will be running on http://localhost:5173
