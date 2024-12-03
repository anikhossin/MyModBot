import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';
import { Command, CommandOptions } from '../types/Command';


export const echo: CommandOptions = {
    data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input')
    .addStringOption(option => option.setName('input').setDescription('The input to echo').setRequired(true))
    .setDefaultMemberPermissions(0),
    execute: async (interaction) => {
        if (interaction.channel?.isTextBased() && interaction.channel.type === ChannelType.GuildText) {
            const input = interaction.options.getString('input') || 'No input provided';
            await interaction.channel.send({ content: input });
            await interaction.reply({ content: 'Message sent', ephemeral: true });
        } else {
            await interaction.reply({ content: 'This command can only be used in a server text channel', ephemeral: true });
        }
    }
}

module.exports = echo;