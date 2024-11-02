# Rhythms

**Rhythms** is a SaaS application built with Next.js that enables creators to set up collaborative music rooms. Creators can add YouTube song links, and users can join via a shared link, upvote songs, and listen as the most popular track plays next. This app is perfect for events, virtual meetups, or social hangouts centered around music.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Features
- **Creator Dashboard:** Easily create rooms and manage playlists.
- **Room Creation:** Shareable rooms with YouTube song links.
- **User Interaction:** Users can upvote songs in real-time.
- **Auto-play Next Track:** The most upvoted song is automatically selected as the next track.
- **Authentication:** Secure login with OAuth.
- **Responsive UI:** Built with Tailwind for a clean and accessible design.

---

## Tech Stack
- **Frontend:** Next.js, Tailwind CSS, Redux-Toolkit
- **Backend:** Prisma ORM, PostgreSQL
- **Authentication:** OAuth
- **Containerization:** Docker
- **Component Library:** Shadcn

---

## Installation

### Prerequisites
- **Node.js** (>=14.x)
- **Docker** (optional, if containerization is required)
- **PostgreSQL**

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/rhythms.git
   cd rhythms
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up the Database**
   - Ensure PostgreSQL is running.
   - Create a new database for Rhythms.
   - Update the connection URL in your `.env` file (see Environment Variables).

4. **Run Migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## Usage
1. **Sign in** via OAuth to access the application.
2. **Create a Room:** In your dashboard, create a room and add YouTube links to the playlist.
3. **Share Room Link:** Share the unique room link with others.
4. **Upvote Songs:** Users can join and upvote their favorite songs.
5. **Enjoy:** The most upvoted song will play automatically as the next track.

---

## Environment Variables
Create a `.env` file in the root directory and add the following environment variables:

```plaintext
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rhythms"

# OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXT_SECRECT="your_secret"

```

---

## License
This project is licensed under the MIT License.

---
