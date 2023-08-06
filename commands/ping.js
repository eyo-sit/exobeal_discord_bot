const { SlashCommandBuilder } = require("discord.js");

nodule.export = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};