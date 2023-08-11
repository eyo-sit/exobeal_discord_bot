// Require the necessary discord.js classes

// fs module is Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');

// path module is Node's native path utility module. path helps construct paths to access files and directories
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });	

//add .commands property to client instance so commands can be acessed in other files
client.commands = new Collection();

//Path to commands
const commandsPath = path.join(__dirname, 'commands');

//Array of .js files at commands
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));	


for (const file of commandFiles){
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	//Set a new item in the collection with the key as the command name and the value as the exported module
	if('data' in command && 'execute' in command){
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code(only once)
// We use 'c' for the event parameter to keep it seperate from the already defined 'client'
// eslint-disable-next-line no-unused-vars
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);

//Create listener for interactions
client.on(Events.InteractionCreate, async interaction => {
	if(!interaction.isChatInputCommand()) return;
	
	//Get command
	const command = interaction.client.commands.get(interaction.commandName);

	if(!command){
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try{
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if(interaction.replied || interaction.deferred){
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true});
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
		}
	}
});