import { Client, GatewayIntentBits, Interaction, ActivityType, Message, GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { loadCommands, registerCommands } from './Handlers/slashCommandHandler';
import dotenv from 'dotenv';
import createTicketButton from './ButtonFunctions/create_ticket_button';
import closeTicket from './ButtonFunctions/close_ticket';
import GetConfig from './Handlers/ConfigCaller';
import HelpMsg from './Handlers/helpCmdMsg';

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildInvites,
  GatewayIntentBits.GuildIntegrations,
  GatewayIntentBits.GuildWebhooks,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.MessageContent,
] });

dotenv.config();

const token: string = process.env.TOKEN || '';
const client_id: string = process.env.CLIENT_ID || '';


const commands = loadCommands();

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  await client.user?.setActivity('Mention me for help', { type: ActivityType.Listening });
  await client.user?.setStatus('idle');
  await registerCommands(client_id, token); 
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find((cmd) => cmd.data.name === interaction.commandName);

  if (!command) {
    console.error(`Command ${interaction.commandName} not found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}:`, error);
    await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
  }
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'create_ticket') {
    await createTicketButton(interaction);
  } else if (interaction.customId === 'close_ticket') {
    await closeTicket(interaction);
  }
}); 

client.on('guildMemberAdd', async (member: GuildMember) => {
  const config = GetConfig();
  const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannel);
  if (!welcomeChannel) return;
  const totalGuildMembers = member.guild.memberCount;
  const embed = new EmbedBuilder()
  .setDescription(
    `> Welcome to ${member.guild.name}, ${member.user}! You are the ${totalGuildMembers}th member.\n` +
    `> We hope you enjoy your stay here.`,
  )
  .setColor('Blurple')
  .setTimestamp()
  .setFooter({ text: 'system codded by @dev_anik' });
  await (welcomeChannel as TextChannel).send({ embeds: [embed] });

})

client.on('messageCreate', async (message: Message) => {
  if (message.content === `<@${client.user?.id}>` || message.content === `<@!${client.user?.id}>`) {
    await HelpMsg(message);
  }
});


client.login(token);