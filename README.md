# Frappe

A simple Discord bot with slash commands.

## Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/arthur875/Frappe.git
    cd Frappe
    ```

2. **Install Node.js and npm**
    > Node.js and npm installation steps are not covered here.

3. **Install dependencies**
    ```bash
    npm install
    ```
    
    This will install all required dependencies including:
    - discord.js
    - dotenv
    - jest (for development/testing)

4. **Configure your bot**
    - Create a `.env` file in the root directory with the following variables:
    ```
    DISCORD_TOKEN=your_discord_bot_token
    CLIENT_ID=your_discord_application_client_id
    GUILD_ID=your_discord_server_id
    ```

## Features

Frappe provides several slash commands:

- `/ping` - Simple ping command that replies with "Pong!"
- `/server` - Provides information about the current server, including name and member count
- `/user` - Provides information about the user who ran the command, including username and join date

## Usage

### Deploying Commands

Before using the bot, you need to deploy the slash commands to your Discord server:

```bash
node deploy_commands.js
```

### Starting the bot
```bash
node index.js
```
