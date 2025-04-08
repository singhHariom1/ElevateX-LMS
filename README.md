# ElevateX - Modern Learning Management System

ElevateX is a full-stack Learning Management System (LMS) built with modern web technologies. It provides a comprehensive platform for course management, student progress tracking, and interactive learning experiences.

## 🚀 Features

- **User Management**

  - User authentication and authorization
  - Role-based access control
  - Profile management

- **Course Management**

  - Create and manage courses
  - Upload course materials
  - Track course progress
  - Interactive course content

- **Media Handling**

  - Support for various media types
  - Cloud storage integration
  - Video streaming capabilities

- **Payment Integration**

  - Secure payment processing
  - Course purchase functionality
  - Webhook support for payment events

- **Progress Tracking**
  - Real-time progress monitoring
  - Course completion tracking
  - Performance analytics

## 🛠️ Tech Stack

### Frontend

- React 18
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Radix UI Components
- Framer Motion
- React Quill
- React Player
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Cloudinary Integration
- Stripe Payment Processing
- Multer for File Uploads

## 📦 Installation

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:

   - Create `.env` files in both client and server directories
   - Refer to `.env.example` for required variables

4. Start the development servers:

```bash
# Start client (from client directory)
npm run dev

# Start server (from server directory)
npm run dev
```

## 🔧 Configuration

### Server Configuration

- Create a `.env` file in the server directory with the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CORS_ORIGIN=http://localhost:5173
```

### Client Configuration

- Create a `.env` file in the client directory with the following variables:

```
VITE_API_URL=http://localhost:3000
```

## 📚 API Endpoints

- `/api/v1/user` - User management
- `/api/v1/course` - Course management
- `/api/v1/media` - Media handling
- `/api/v1/purchase` - Purchase management
- `/api/v1/progress` - Progress tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

Hariom Singh 