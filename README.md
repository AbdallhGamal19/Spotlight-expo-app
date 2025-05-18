# 🌟 Spotlight

**Spotlight** is a modern mobile social media app that allows users to express themselves, connect with others, and stay updated in real time. The app is built using **React Native**, **Expo**, and **Clerk** for seamless authentication.

---

## 📲 App Flow

### 🔐 Authentication

- When the app launches, users are taken to the **sign in / sign up screen**, powered by [Clerk](https://clerk.dev/).
- Users can sign in using email or other supported providers.
- Once authenticated, users are navigated to the **home feed**.

### 🏠 Home Feed

- The home screen shows **latest posts** from users you follow.
- Each post includes:
  - Username and profile photo
  - Text content
  - Post date (formatted using `date-fns`)
  - Like button
  - Comment button
  - Bookmark button

### ➕ Create a Post

- Users can add a new post from the **“+” (add post)** button in the bottom navigation bar.
- After posting, the content appears instantly in the feed.

### 💬 Comments & Likes

- Users can tap on a post to view and add **comments**.
- Each post can be **liked** and unliked.

### 🗑️ Delete Post

- If the logged-in user is the **owner of the post**, a delete option is shown.
- Deleting removes the post for everyone.

### 📖 Bookmarks

- Users can bookmark any post to save it for later.
- Bookmarked posts are accessible from the **profile page**.

### 📚 Stories

- A horizontal stories section is available at the top of the home screen.
- Stories are short, time-limited content from users you follow.

### 👥 Follow System

- Each profile includes a **Follow / Unfollow** button.
- The feed only shows posts from people the user follows.

### 🔔 Notifications

- Users receive **real-time notifications** when:
  - Someone likes their post
  - Someone comments
  - Someone follows them

### 👤 Profile Page

- Accessible from the bottom tab bar.
- Shows:
  - User info (username, bio, followers/following)
  - User’s posts
  - Bookmarked posts tab

### 🚪 Logout

- The profile page includes a **Sign Out** button to log out securely.

---

## 🛠 Tech Stack

- **React Native** with **Expo**
- **Expo Router** for routing and navigation
- **Clerk** for authentication
- **Convex** as a backend and database
- **Date-fns** for time formatting
- **React Navigation** for screen transitions
- **Expo Image Picker**, Haptics, Blur, and more for rich UI/UX

---

## 📦 Getting Started

```bash
git clone https://github.com/your-username/spotlight.git
cd spotlight
npm install
npm start
```
