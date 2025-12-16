# StudentStudy

A homework reminder and grade tracking web application for high school and college students.

## 🚀 Quick Start with StackBlitz

**No installation needed!** Import this repo directly into StackBlitz:

1. Go to [stackblitz.com](https://stackblitz.com)
2. Click "Import from GitHub" and paste this repo URL
3. The app runs automatically in your browser! 🎉

**That's it!** No accounts, no setup, no configuration needed.

---

## Features

- 📝 **Assignment Management** - Create, track, and manage daily homework and long-term projects
- 📊 **Grade Tracking** - Monitor your academic performance with percentage-based grades
- 📅 **Calendar View** - Visualize all your deadlines in a clean calendar interface
- 🔔 **Smart Reminders** - Get notified about upcoming due dates with escalating urgency
- 👥 **Class Management** - Teachers can create classes and add students
- 🌙 **Dark Mode** - Easy on the eyes with light and dark theme support
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 💾 **Local Storage** - All your data saves automatically in your browser

## Tech Stack

- **Frontend**: React 18, React Router v6
- **Styling**: Tailwind CSS
- **Storage**: Browser Local Storage (no server needed!)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Option 1: StackBlitz (Easiest - No Installation!)

1. Go to [stackblitz.com](https://stackblitz.com)
2. Import this GitHub repo
3. Done! Start using the app immediately

### Option 2: Local Development

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   cd studentstudy
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
studentstudy/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Buttons, inputs, cards, etc.
│   │   ├── layout/      # Navbar, sidebar, layout
│   │   ├── auth/        # Authentication components
│   │   └── assignments/ # Assignment-specific components
│   ├── context/         # React contexts (Auth, Theme, Notifications)
│   ├── pages/           # Page components
│   ├── services/        # Local storage service
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## User Roles

### Students
- Create personal assignments
- View teacher-posted assignments
- Track assignment status (Not Started → In Progress → Completed)
- Record and view grades
- Join classes (added by teacher)

### Teachers
- Create and manage classes
- Add students to classes by student ID
- Post assignments to entire classes
- View student homework status

## How Data is Stored

All your data is stored locally in your browser using localStorage. This means:
- ✅ No account creation with external services needed
- ✅ Works offline after first load
- ✅ Your data stays private on your device
- ⚠️ Data is specific to the browser/device you use
- ⚠️ Clearing browser data will delete your assignments

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Demo Account

When you register a new account, demo data is automatically added so you can see how the app works!

## License

MIT License - feel free to use this project for learning or building your own homework app!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
