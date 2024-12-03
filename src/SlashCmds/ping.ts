import { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../types/Command';

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
    .setTitle('Current Ping')
    .setDescription(`Pong! ${interaction.client.ws.ping}ms`)
    .setColor('Blurple')
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

module.exports = ping; 
