import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { Command } from '../types/Command';

const commands: Command[] = [];

export const loadCommands = () => {
  const commandFiles = fs
    .readdirSync(path.join(__dirname, '../SlashCmds'))
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`../SlashCmds/${file}`) as Command;
    commands.push(command);
  }

  return commands;
};

export const registerCommands = async (clientId: string, token: string, guildId?: string) => {
  const rest = new REST({ version: '10' }).setToken(token);

  const slashCommands = commands.map((cmd) => cmd.data.toJSON());

  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: slashCommands,
      });
      console.log('Successfully registered guild slash commands.');
    } else {
      await rest.put(Routes.applicationCommands(clientId), {
        body: slashCommands,
      });
      console.log('Successfully registered global slash commands.');
    }
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
};
