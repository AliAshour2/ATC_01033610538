# EventTech - Event Management Platform

A modern event management platform built with React, TypeScript, and Firebase.

## Features

- 🔐 User Authentication & Authorization
- 👥 User Role Management (Admin/User)
- 📅 Event Creation and Management
- 🎟️ Booking System
- 📊 Admin Dashboard with Analytics
- 💳 Payment Processing
- 📱 Responsive Design
- 🌓 Dark/Light Theme Support

## Tech Stack

- **Frontend:**
  - React 19
  - TypeScript
  - Redux Toolkit
  - React Router v7
  - Tailwind CSS
  - Framer Motion
  - Lucide Icons

- **Backend:**
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Storage

- **Development Tools:**
  - Vite
  - ESLint
  - Jest/Vitest
  - MSW (Mock Service Worker)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/aliashour2/eventech.git
cd eventech
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

4. Start the development server
```bash
npm run dev
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run seed` - Seed sample data

## Project Structure

```
eventech/
├── src/
│   ├── app/          # Redux store configuration
│   ├── components/   # Reusable components
│   ├── features/     # Feature-specific components and logic
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Third-party library configurations
│   ├── pages/        # Page components
│   ├── routes/       # Route configurations
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── public/           # Static assets
└── scripts/         # Build and setup scripts
```

## Features in Detail

### User Management
- User registration and authentication
- Role-based access control (Admin/User)
- Profile management

### Event Management
- Create and manage events
- Event categories and tags
- Event search and filtering
- Event booking system

### Admin Dashboard
- User analytics
- Booking statistics
- Revenue tracking
- Event management
- User management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
