const { SlashCommandBuilder } = require('discord.js');

nodule.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about the user.'),
    async execute(interaction) {
        //interaction.user is the object representing the User who ran the command
        //interaction.member is the Guildmember object, which represents the user in the specified guild
        await interaction.reply(`This command was run by ${interatcion.user.username}, who joined on ${interaction.member.joinedAt}.`);
    },
};