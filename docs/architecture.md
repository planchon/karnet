# Engineering Architecture
This document describes the engineering architecture of the Karnet project.

# Backend
## Agent
The agent is the code running the Alfred AI logic. The agent has a pi.dev base and Karnet specific tools. 
The agent is spawned in a Daytona sandbox. The sandbox always has the right memory, permissions and tools.

## Server
The server is running in Railway. It the entry point for the agent. Everything determinist runs through the server.
- Message routing
- Tools
- Scheduling
- Memory

# Apps
## Expo
Karnet need an app to be able to interact with the user. The app is an Expo app.
The app is used for:
- notifications
- gps position
- sharing things to it

The app is also the display for the agent. 

## Web
The web is the main display for agent. The agent can interact with a full React web app. It can interact with it and do what ever it wants.