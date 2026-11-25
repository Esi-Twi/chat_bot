# Fashion Design AI Chatbot

A full-stack AI chatbot built with **Python, FastAPI, React, and the Fashion Design API**. The application allows users to interact with an AI model through a web-based chat interface, with the backend handling AI requests and conversation history.

This project is part of my journey into building AI-powered applications and learning how to integrate Large Language Models (LLMs) into full-stack software.

## Features

- **AI-powered conversations:** Interact with an LLM using the Groq API.
- **React frontend:** A web-based chat interface for sending and receiving messages.
- **FastAPI backend:** Handles API requests and communicates with the Groq model.
- **Conversation management:** Create conversations and maintain message history during a session.
- **Markdown rendering:** Displays AI responses with properly formatted headings, tables, lists, links, and code blocks.
- **Loading and error states:** Provides feedback while waiting for AI responses and when requests fail.
- **New conversation:** Start a fresh chat with a separate conversation ID.
- **Environment variables:** Keeps API credentials outside the source code.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, FastAPI |
| AI Integration | Groq API |
| HTTP Requests | Axios |
| Markdown | React Markdown, Remark GFM, Rehype Sanitize |
| Environment Management | Python Dotenv |

## Architecture

The application follows a client-server architecture.

```text
                 USER
                   |
                   v
          REACT FRONTEND
             (Vite)
                   |
                   | HTTP Requests
                   v
          FASTAPI BACKEND
                   |
                   | Conversation History
                   v
              Fashion Design API
                   |
                   v
              AI MODEL
                   |
                   v
          AI RESPONSE
                   |
                   v
          REACT FRONTEND
```

The frontend is responsible for the user interface, while the backend manages conversations and communicates with the Fashion Design API. The Groq API processes messages and returns AI-generated responses.

## Project Structure

```text
Fashion Design-chatbot/
│
├── backend/
│   ├── main.py
│   ├── chatbot.py
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MarkdownMessage.jsx
│   │   │   └── MarkdownMessage.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check whether the backend is running |
| POST | `/api/v1/conversations` | Create a new conversation |
| POST | `/api/v1/chat` | Send a message and receive an AI response |

## How It Works

1. A user opens the React application.
2. The frontend requests a new conversation from the FastAPI backend.
3. The backend generates a unique conversation ID.
4. The user submits a message through the chat interface.
5. The frontend sends the message and conversation ID to the backend.
6. The backend retrieves the conversation history and sends the messages to Groq.
7. Groq generates a response using the configured AI model.
8. The backend returns the response to React and updates the conversation history.
9. React Markdown renders the response into readable content.

## Current Limitations

This is an early version of the application. Some features are not yet implemented:

- Conversation history is stored in backend memory and is lost when the server restarts.
- No user authentication or account management.
- No persistent database storage.
- No streaming responses.
- No conversation history retrieval after restarting the application.
- Token management and conversation context optimization are still being developed.

## Future Improvements

- [ ] Integrate PostgreSQL for persistent conversation storage.
- [ ] Implement user authentication and authorization.
- [ ] Add streaming responses for a more interactive experience.
- [ ] Implement token counting and conversation context management.
- [ ] Allow users to rename and delete conversations.
- [ ] Add conversation history retrieval.
- [ ] Implement model selection.
- [ ] Add file uploads and document-based question answering (RAG).
- [ ] Implement automated backend and frontend tests.
- [ ] Dockerize the application for deployment.
- [ ] Deploy the application.

## Learning Objectives

Through this project, I am exploring:

- Integrating Large Language Models into full-stack applications.
- Working with the Groq API.
- Building REST APIs with FastAPI.
- Connecting Python backends to React frontends.
- Managing conversation history and message context.
- Rendering Markdown in AI-generated responses.
- Managing environment variables and API credentials.
- Understanding the architecture of AI-powered applications.

