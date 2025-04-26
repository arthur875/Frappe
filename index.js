// require the necessary discord.js classes
const {Client, Events, GatewayIntentBits} = require('discord.js');
require('dotenv').config();

// in order to use the variable from dotenv
const token = process.env.DISCORD_TOKEN;

// create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds]});

// When client is ready, run this code (only once).
// we set the event listener before loggin in the user in order to be sure to catch it.
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready!, Logged in as ${readyClient.user.tag}`);
});


// Log in to Discord with your client's token
client.login(token);