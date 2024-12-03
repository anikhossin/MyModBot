import {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    TextChannel,
    ChatInputCommandInteraction,
    Message
  } from 'discord.js';
  import { Command } from '../types/Command';
  
  export const TicketPanel: Command = {
    data: new SlashCommandBuilder()
      .setName('ticketpanel')
      .setDescription('Creates a ticket panel'),
    execute: async (interaction: ChatInputCommandInteraction) => {

      if (!interaction.channel || !(interaction.channel instanceof TextChannel)) {
        await interaction.reply({ content: 'This command can only be used in a text channel.', ephemeral: true });
        return;
      }
      await interaction.reply({ content: 'Please provide the title for the ticket panel embed:', ephemeral: false });
      const filter = (response: any) => response.author.id === interaction.user.id;
      const titleCollector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });
  
      titleCollector.on('collect', async (titleMessage) => {
        const title = titleMessage.content;
        if (title.length > 10) {
          await interaction.followUp({ content: 'Title is too long. Please keep it under 256 characters.', ephemeral: true });
          return;
        }
        await interaction.followUp({ content: 'Now, provide the description for the ticket panel embed:', ephemeral: false });
        const descriptionCollector = (interaction.channel as TextChannel).createMessageCollector({ filter, max: 1, time: 60000 });
  
        descriptionCollector.on('collect', async (descMessage: Message) => {
          const description = descMessage.content;
          if (description.length > 1024) {
            await interaction.followUp({ content: 'Description is too long. Please keep it under 1024 characters.', ephemeral: true });
            return;
          }

          const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('Blurple')
            .setTimestamp()
            .setThumbnail(interaction.guild?.iconURL() || '')
            .setFooter({ text: 'system codded by @dev_anik'});
  

          const button = new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('Create Ticket')
            .setStyle(ButtonStyle.Primary);
  

          const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
  

          await (interaction.channel as TextChannel).send({
            embeds: [embed],
            components: [actionRow],
          });
  
          await interaction.followUp({ content: 'Ticket panel created successfully!', ephemeral: true });
          descriptionCollector.stop();
        });
  
        descriptionCollector.on('end', (collected, reason) => {
          if (reason === 'time') {
            interaction.followUp({ content: 'You took too long to provide the description. Please try again.', ephemeral: true });
          }
        });
  
        titleCollector.stop();
      });
  
      titleCollector.on('end', (collected, reason) => {
        if (reason === 'time') {
          interaction.followUp({ content: 'You took too long to provide the title. Please try again.', ephemeral: true });
        }
      });
    },
  };
  

module.exports = TicketPanel;