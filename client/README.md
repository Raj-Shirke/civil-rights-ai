# Nyaya AI: Civil Rights Assistant

Nyaya AI is a specialized AI-powered application designed to provide information and guidance on civil rights. Built as a cross-platform solution, it offers a seamless experience on both Web and Android devices.

## 🚀 Key Features

- **AI Legal Guidance**: Provides instant responses to queries regarding civil rights and legal procedures.
- **Cross-Platform**: Built using the MERN stack for the web and Capacitor for a native Android experience.
- **Voice Integration**: Designed for ease of use with mobile-first interactions.
- **Responsive UI**: Optimized full-screen layout for both desktop monitors and mobile screens.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Capacitor.
- **Backend**: Node.js, Express.
- **AI Integration**: Gemini API.
- **Styling**: Modern CSS3 with responsive viewport-fit designs.

---

## 📥 How to Import and Setup

Follow these steps to get the project running on your local machine:

### 1. Clone the Repository

````bash
git clone [https://github.com/Raj-Anil-Shirke/civil-rights-ai.git](https://github.com/Raj-Anil-Shirke/civil-rights-ai.git)
cd civil-rights-ai
2. Setup the Backend
Open a terminal in the root folder.

Install dependencies:

Bash
npm install
Create a .env file and add your API keys:

Code snippet
GEMINI_API_KEY=your_key_here
PORT=5000
Start the server:

Bash
node server.js


### 3. Setup the Frontend
1. Open a new terminal and navigate to the `client` folder:
   ```bash
   cd client
   npm install
Start the development server:

Bash
npm run dev -- --host


### 4. Running on Android (Optional)
1. Ensure you have **Android Studio Panda 4** installed.
2. Sync the project with Capacitor:
   ```bash
   npx cap sync android

Open the android folder in Android Studio and run it on your device.
````
