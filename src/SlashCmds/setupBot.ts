import { SlashCommandBuilder, EmbedBuilder, ChannelType, ChatInputCommandInteraction, GuildMemberRoleManager } from 'discord.js';
import { CommandOptions } from '../types/Command';
import fs from 'fs';
import path from 'path';

export const setupBot: CommandOptions = {
  data: new SlashCommandBuilder()
    .setName('setupbot')
    .setDescription('Sets up the bot')
    .setDefaultMemberPermissions(0) 
    .addChannelOption(option =>
      option
        .setName('ticket-category')
        .setDescription('The category to open tickets in')
        .setRequired(true)
    )
    .addRoleOption(option =>
        option
        .setName('support-role')
        .setDescription('The role to give to support staff')
        .setRequired(true)
    )
    .addChannelOption(option =>
        option
        .setName('welcome-channel')
        .setDescription('The channel to send welcome messages to')
        .setRequired(false)
    )
    .addChannelOption(option =>
        option
        .setName('ticket-transcript')
        .setDescription('The channel to send ticket transcripts to')
        .setRequired(false)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const selectedChannel = interaction.options.getChannel('ticket-category', true);
    const supportRole = interaction.options.getRole('support-role', true);
    const welcomeChannel = interaction.options.getChannel('welcome-channel', false);
    const ticketTranscript = interaction.options.getChannel('ticket-transcript', false);
    if (selectedChannel.type !== ChannelType.GuildCategory) {
      await interaction.reply({ content: 'Please select a category for the ticket category', ephemeral: true });
      return;
    }
    if (welcomeChannel?.type !== ChannelType.GuildText) {
      await interaction.reply({ content: 'Please select a text channel for the welcome channel', ephemeral: true });
      return;
    }
    if (ticketTranscript?.type !== ChannelType.GuildText) {
      await interaction.reply({ content: 'Please select a text channel for the ticket transcript channel', ephemeral: true });
      return;
    }
    const configFilePath = path.join(__dirname, '..', '..', 'BotConfig.json');
    const config = {
      ticketCategory: selectedChannel.id,
      supportRole: supportRole.id,
      welcomeChannel: welcomeChannel.id,
      ticketTranscript: ticketTranscript.id,
    };
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    await interaction.reply({ content: 'Bot setup complete', ephemeral: true });
  }
};

module.exports = setupBot;