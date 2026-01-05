# API Documentation

This documentation provides details for all backend APIs available for the application.

**Base URL:** `http://localhost:5000/api`

## Authentication & Authorization

Most endpoints require an authentication token.
- **Header:** `Authorization`
- **Value:** `Bearer <your_token>`

> **Note:** After logging in, store the `token` received in the response and send it in the header for protected routes as shown above.

---

## 1. Authentication APIs

### 1.1 Sign Up
**Route:** `POST /auth/signup`
**Description:** Register a new user.
**Auth Required:** No

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | String | Yes | User's email address |
| `password` | String | Yes | User's password |
| `confirmPassword` | String | Yes | Must match the password |
| `fullName` | String | Yes | User's full name |

**Success Response (201):**
```json
{
  "status": 1,
  "msg": "User registered successfully",
  "user": { ... }
}
```

### 1.2 Login
**Route:** `POST /auth/login`
**Description:** Authenticate user and receive a JWT token.
**Auth Required:** No

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | String | Yes | User's email |
| `password` | String | Yes | User's password |

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "673...",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```
> **Frontend Action:** Save `token` in LocalStorage/Context. Redirect to Dashboard/Feed.

### 1.3 Complete/Update Profile
**Route:** `PUT /auth/profile`
**Description:** Update user profile details including profile image.
**Auth Required:** Yes
**Content-Type:** `multipart/form-data`

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `profileImage` | File | No | Image file to upload |
| `name` | String | Yes | Full Name |
| `dob` | String | No | Date of Birth |
| `country` | String | No | Country Name |
| `gender` | String | No | Gender |

**Success Response (200):**
```json
{
  "_id": "...",
  "fullName": "Updated Name",
  "profileImage": "https://cloudinary.com/...",
  "isProfileComplete": true,
  ...
}
```
> **Frontend Action:** Use `FormData` to send this request.

### 1.4 Logout
**Route:** `POST /auth/logout`
**Description:** Logout the user (Server-side this effectively just confirms the action, client should remove token).
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "msg": "Logged out successfully"
}
```

### 1.5 Delete Account
**Route:** `DELETE /auth/delete`
**Description:** Permanently delete user account and all associated data (posts, comments, likes, follows).
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "msg": "User account deleted successfully"
}
```

---

## 2. Social APIs

### 2.1 Create Post
**Route:** `POST /social/post`
**Description:** Create a new social post with an image.
**Auth Required:** Yes
**Content-Type:** `multipart/form-data`

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `image` | File | Yes | Image file to upload |
| `caption` | String | No | Text caption for the post |

**Success Response (201):**
```json
{
  "msg": "Post created successfully",
  "newPost": {
    "user": "...",
    "imageUrl": "...",
    "caption": "...",
    "_id": "..."
  }
}
```

### 2.2 Get All Posts (Discovery)
**Route:** `GET /social/all-posts`
**Description:** Retrieve all posts from all users (sorted by newest).
**Auth Required:** Yes

**Success Response (200):**
```json
[
  {
    "_id": "...",
    "user": {
      "fullName": "Jane Doe",
      "profileImage": "..."
    },
    "imageUrl": "...",
    "caption": "...",
    "likes": [],
    "createdAt": "..."
  },
  ...
]
```

### 2.3 Get Feed
**Route:** `GET /social/feed`
**Description:** Retrieve posts **only** from users the current user follows.
**Auth Required:** Yes

**Success Response (200):**
```json
// Returns Array of Post objects (same structure as above)
```

### 2.4 Search Users
**Route:** `GET /social/search`
**Description:** Search for users by name.
**Auth Required:** Yes

| Query Parameter | Description |
| :--- | :--- |
| `query` | The name or partial name to search for (e.g., `?query=john`) |

**Success Response (200):**
```json
[
  {
    "_id": "...",
    "fullName": "John Doe",
    "profileImage": "..."
  }
]
```

### 2.5 Toggle Like
**Route:** `PUT /social/like/:postId`
**Description:** Like or Unlike a post.
**Auth Required:** Yes

| Path Parameter | Description |
| :--- | :--- |
| `postId` | The ID of the post to like/unlike |

**Success Response (200):**
```json
{
  "msg": "Liked" // or "Unliked",
  "likesCount": 5
}
```

### 2.6 Follow User
**Route:** `POST /social/follow/:id`
**Description:** Follow another user.
**Auth Required:** Yes

| Path Parameter | Description |
| :--- | :--- |
| `id` | The ID of the user to follow |

**Success Response (200):**
```json
{
  "msg": "Followed successfully"
}
```
