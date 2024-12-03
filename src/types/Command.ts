import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder; 
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface CommandOptions {
  data: SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}