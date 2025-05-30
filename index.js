// require the necessary discord.js classes
const {Client, Collection, Events, GatewayIntentBits} = require('discord.js');
// require the necessary node.js classes
const fs = require('node:fs');
const path = require('node:path');
// for security reason we will store the token in a .env file
require('dotenv').config();

// in order to use the variable from dotenv
const token = process.env.DISCORD_TOKEN;

// create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds]});

// find slash commands files
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
// for each subfolder in the commands folder you take the path of the folder and the js files
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// execute slash commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});



// When client is ready, run this code (only once).
// we set the event listener before loggin in the user in order to be sure to catch it.
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready!, Logged in as ${readyClient.user.tag}`);
});


// Log in to Discord with your client's token
client.login(token);