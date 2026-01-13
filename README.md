# Organick Fullstack

Organick is a full-stack e-commerce application designed for selling organic food products such as vegetables, fruits, and more. The application includes a user-friendly client interface for browsing and purchasing products, as well as a comprehensive admin management interface for overseeing users, products, orders, and categories.

## Features

- **User Authentication**: Login, signup, password reset, and email verification using NextAuth.
- **User Management**: Update profile information and avatar with Cloudinary integration.
- **Product Management**: Create, edit, delete products with image uploads.
- **Order Management**: Place orders, view order history, and manage order statuses.
- **Category Management**: Organize products into categories.
- **Shopping Cart**: Add products to cart with stock quantity checks.
- **Product Filtering**: Filter by category, rating, price, and search functionality.
- **Payment Integration**: Secure checkout using Stripe with webhook support.
- **Admin Dashboard**: Manage users, products, orders, and categories with pagination and export capabilities.
- **SEO Optimization**: Sitemap and robots.txt for better search engine visibility.
- **Responsive Design**: Fully responsive UI using Material-UI and SCSS.
- **Email Notifications**: Automated emails for password reset and account verification.

## Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Styling**: SCSS
- **State Management**: React Query (TanStack Query)
- **Authentication**: NextAuth
- **Payment**: Stripe React SDK
- **Animations**: AOS (Animate On Scroll)
- **Icons**: FontAwesome, Tabler Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs
- **File Upload**: Multer, Cloudinary
- **Email**: Nodemailer
- **Payment**: Stripe SDK
- **Validation**: Joi
- **Utilities**: Lodash, Moment.js

## Architecture

The application follows a client-server architecture:

- **Frontend**: Built with Next.js for server-side rendering and static generation, providing a fast and SEO-friendly user experience.
- **Backend**: RESTful API built with Express.js, handling business logic, database interactions, and integrations.
- **Database**: MongoDB for flexible data storage.
- **Deployment**: Frontend deployed on Vercel, backend can be deployed on services like Heroku or AWS.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Stripe account for payments
- Cloudinary account for image storage
- Email service (e.g., Gmail) for notifications

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/organick-fullstack.git
   cd organick-fullstack
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Frontend
   cd FE
   npm install

   # Backend
   cd ../BE
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `FE` and `BE` directories.
   - Configure the following variables:
     - **Backend**: MongoDB URI, JWT secret, Stripe keys, Cloudinary credentials, email settings.
     - **Frontend**: NextAuth configuration, Stripe publishable key, API base URL.

### Usage

1. Start the backend server:
   ```bash
   cd BE
   npm run dev
   ```
   The server will run on `http://localhost:5000` (or configured port).

2. Start the frontend development server:
   ```bash
   cd FE
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

### API Documentation

API endpoints are documented in Postman. Access the collection here: [Organick API Collection](https://www.postman.com/crimson-zodiac-919695/organick).

Key endpoints include:
- Authentication: `/api/v1/auth`
- Users: `/api/v1/users`
- Products: `/api/v1/products`
- Orders: `/api/v1/orders`
- Categories: `/api/v1/categories`

## Deployment

The application is deployed on Vercel. Visit the live demo: [https://organick-fullstack.vercel.app/](https://organick-fullstack.vercel.app/home).

For backend deployment, consider platforms like Heroku, AWS, or DigitalOcean.

## Configuration

### Stripe Testing
Use the following test card for checkout: `4242 4242 4242 4242`

### Admin Account
- Email: `admin@gmail.com`
- Password: `123456789`

## Reference UI

The design is inspired by [Organick Template](https://organick-template.webflow.io/).

## Support

For issues or questions, contact: tinnhat0412@gmail.com
