# Online Trauma Sensitization Workshop

A production-ready React web application for managing workshop registrations, with Firebase backend, EmailJS notifications, and WhatsApp Cloud API integration.

## Features
- **Public**: Modern white & blue UI, Registration Form, Dynamic Workshop Details.
- **Admin**: Dashboard, Registrants Management (Search, Export, Delete), Bulk Email/WhatsApp, Workshop Settings.
- **Integrations**: Firebase (Auth, Firestore), EmailJS, Facebook Graph API (WhatsApp).

## Prerequisites
- Node.js (v14+)
- A Firebase Project (API Key, Auth Domain, etc.)
- EmailJS Account (Service ID, Template ID, User ID)
- Meta Developer Account (for WhatsApp Cloud API)

## Setup Instructions

### 1. Installation
Run the following command to install dependencies:
```bash
npm install
```

### 2. Firebase Configuration
Open `src/firebase.js` and replace the placeholder `firebaseConfig` with your actual project keys from the Firebase Console.

### 3. EmailJS Configuration
Open `src/utils/sendEmail.js` and update `SERVICE_ID`, `TEMPLATE_ID`, and `USER_ID` with values from your EmailJS dashboard.

### 4. Running Locally
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 5. Admin Login
- Default Username: `admin` (or `kabodbiblecollege@gmail.com`)
- Default Password: `kabod@2026`
*(Note: Ensure you have an account in Firebase Auth with email `kabodbiblecollege@gmail.com`)*

## Folder Structure
- `src/components`: Shared UI (Navbar, Banner, Footer)
- `src/pages`: Public pages (Home, Register, Thank You)
- `src/admin`: Admin dashboard & sub-pages
- `src/utils`: API wrappers
- `src/styles`: CSS variables and global styles
