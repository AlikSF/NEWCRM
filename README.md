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

## Database

This app uses SQL.js for local browser-based storage. All data is stored in your browser's localStorage, so no external database service is required.

The database is automatically initialized with sample data when you first run the app.

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

The local database includes the following tables:
- `organizations` - Tour company information
- `leads` - Potential customers
- `tours` - Tour catalog
- `bookings` - Customer bookings
- `inbox_threads` - Conversation threads
- `inbox_messages` - Messages within threads
- `notifications` - User notifications

All data persists in your browser's localStorage.
