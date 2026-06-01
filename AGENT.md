# Karnet
Karnet is a personal AI assistant. Karnet can remember, schedule and plan.
Karnet is not primarily a product for the masses. It is an assistant made for its owner first: simple, calm, correctable and useful over time.
Karnet is not a chatbot, it is an all-in assistant.

## Core features
### Ingestion
Karnet can ingest information from :
- the karnet app
- from telegram

Everything is stored in your Karnet.

### Remember
When Karnet ingest something, it will be remembered, Karnet stores information in Notion and in its own database.

### Schedule
Karnet can schedule its own task.

### V0 direction
The first version focuses on:
- ingestion from Telegram and/or the Karnet app;
- structured memory;
- a simple home with non-intrusive suggestions;
- explicit reminders requested by the user.

Advanced contextual notifications, such as GPS-based suggestions, come later once the memory is clean enough and permissions are well controlled.

## Architecture
### Application
The Karnet application is an expo app and the web interface. It the main entry point for the user. The goal of this app is to get data from the user phone easily : position, calendar, sharing things... 

### Backend
The backend is composed of two parts : 
- the agent, using tools etc to achieve the user's goals.
- the backend, handling the invocation of the agent and the communication with the user.
