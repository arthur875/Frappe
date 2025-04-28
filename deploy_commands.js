const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const token = process.env.DISCORD_TOKEN;
const ClientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// grab all the folders from the commands directory
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    //Grab SlashCommandBuilder#toJSON output for each command's data
    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command){
            commands.push(command.data.toJSON());
        }else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

//construct and prepare an instance of REST
const rest = new REST().setToken(token);

//and deploy the commands
(async () =>{
    try{
        console.log(`Started refreshing ${commands.length} application (/) commands.`)

        //use the put method to refresh the data inside of the guilds
        const data = await rest.put(
			Routes.applicationGuildCommands(ClientId, guildId),
			{ body: commands },
		);
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch(error){
        console.error(error);
    }
})();