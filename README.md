# YUI Tracking System

An ERPNext-inspired hospital trainee and employee tracking system built with Next.js 15, TypeScript, Tailwind CSS, and MongoDB.

## Features
- **Dashboard**: Real-time overview of personnel, departments, and activities.
- **Departments**: Manage hospital departments and track occupancy.
- **Personnel Directory**: Track employees and trainees, including their current status (Working, Available, On Break, Off Duty).
- **Task Assignments**: Assign tasks to personnel and track completion status.
- **Historical Logs**: Detailed audit trail of all status and location changes.
- **Modern UI**: Glassmorphic design with full dark mode support.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MongoDB & Mongoose
- Lucide React (Icons)

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd yui-tracking-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/yui-tracking
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema
The system uses the following MongoDB collections:
- `users`: Employees and Admins.
- `trainees`: Trainee personnel.
- `departments`: Hospital departments.
- `assignments`: Tasks assigned to personnel.
- `attendances`: Check-in and check-out tracking.
- `activitylogs`: Historical audit trail of movements.
