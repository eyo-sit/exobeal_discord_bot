// fs module is Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');

// path module is Node's native path utility module. path helps construct paths to access files and directories
const path = require('node:path');

// Require the necessary discord.js classes	
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });	

//add .commands property to client instance so commands can be acessed in other files
client.commands = new Collection();

//Path to commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

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

const eventPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for( const file of eventFiles){
	const filePath = path.join(eventPath, file);
	const event = require(filePath);
	if(event.once){
		client.once(event.name, (...args) => event.execute(...args));
	}else{
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// // When the client is ready, run this code(only once)
// // We use 'c' for the event parameter to keep it seperate from the already defined 'client' // eslint-disable-next-line no-unused-vars
// client.once(Events.ClientReady, () => {
// 	console.log('Ready!');
// });

// //Create listener for interactions
// client.on(Events.InteractionCreate, async interaction => {
// 	if (!interaction.isChatInputCommand()) return;

// 	const command = interaction.client.commands.get(interaction.commandName);

// 	if (!command) {
// 		console.error(`No command matching ${interaction.commandName} was found.`);
// 		return;
// 	}

// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		if (interaction.replied || interaction.deferred) {
// 			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
// 		} else {
// 			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 		}
// 	}
// });


// Log in to Discord with your client's token
client.login(token);