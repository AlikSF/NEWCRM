# TourCRM Dashboard

A complete tour management CRM system with local database storage.

## Features

- Lead management and tracking
- Tour catalog management
- Booking system
- Inbox for client communications
- Notifications
- Team management
- Reports and analytics
- Dark mode support

## Database Setup

This app uses Bolt's managed database for data persistence.

### Setting Up the Database

1. Go to Project Settings in Bolt
2. Click on the "Database" section
3. Copy the contents of `database-schema.sql` and paste it into the database query editor
4. Run the query to create all required tables

The app will automatically initialize the database with sample data on first run.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

## Database Structure

The database includes the following tables:
- `organizations` - Tour company information
- `leads` - Potential customers
- `tours` - Tour catalog
- `bookings` - Customer bookings
- `inbox_threads` - Conversation threads
- `inbox_messages` - Messages within threads
- `notifications` - User notifications

All data is securely stored in the cloud database.
