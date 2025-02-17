# Notes API (CRUD App)

## Overview
The Notes API is a simple CRUD (Create, Read, Update, Delete) application that allows users to manage their notes. This API is built using Node.js, Express.js, and MongoDB.

LIVE URL - https://stunning-quokka-be66dc.netlify.app

## Features
- Create a new note
- Retrieve all notes
- Retrieve a specific note by ID
- Update a note by ID
- Delete a note by ID

## Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose ODM)
- Postman (for testing API endpoints)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/notes-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd notes-api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     ```
5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### 1. Create a Note
- **Endpoint:** `POST /api/notes`
- **Description:** Creates a new note.
- **Request Body:**
  ```json
  {
    "title": "Sample Note",
    "content": "This is a sample note."
  }
  ```
- **Response:**
  ```json
  {
    "_id": "note_id",
    "title": "Sample Note",
    "content": "This is a sample note.",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```

### 2. Get All Notes
- **Endpoint:** `GET /api/notes`
- **Description:** Retrieves all notes.
- **Response:**
  ```json
  [
    {
      "_id": "note_id",
      "title": "Sample Note",
      "content": "This is a sample note."
    }
  ]
  ```

### 3. Get a Note by ID
- **Endpoint:** `GET /api/notes/:id`
- **Description:** Retrieves a specific note by ID.

### 4. Update a Note
- **Endpoint:** `PUT /api/notes/:id`
- **Description:** Updates a note by ID.
- **Request Body:**
  ```json
  {
    "title": "Updated Note",
    "content": "Updated content."
  }
  ```

### 5. Delete a Note
- **Endpoint:** `DELETE /api/notes/:id`
- **Description:** Deletes a note by ID.

## Database Schema
Below is the database schema used for the Notes API:

![image](https://github.com/user-attachments/assets/43a04291-258c-43b5-ad3c-9feaa36d9c88)


### Tables and Relationships:
1. **notes**: Stores the notes created by users. Each note is linked to a user (`user_id`).
2. **tags**: Stores tags created by users and linked to notes through `note_tags`.
3. **note_tags**: A junction table that associates notes with multiple tags.
4. **profiles**: Stores user profile information such as `username` and `avatar_url`.
5. **auth.users**: External authentication reference linking users to their notes and tags.

## License
This project is licensed under the MIT License.

## Author
Created by ARYAN MORE .

