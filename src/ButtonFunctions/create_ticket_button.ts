import {
    EmbedBuilder,
    ButtonInteraction,
    StringSelectMenuBuilder,
    ComponentType,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    StringSelectMenuInteraction,
  } from 'discord.js';

import createBuyTicket from './buy_ticket';
import SupportTicketMoal from './support_ticket';
import GetConfig from '../Handlers/ConfigCaller';
  
  const createTicketButton = async (interaction: ButtonInteraction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const config = GetConfig();
      const ticketCategory = interaction.guild?.channels.cache.get(config.ticketCategory);
      if (!ticketCategory) {
        return interaction.editReply({
          content: 'Bot configuration error. Please contact an administrator.',
        });
      }
      const embed = new EmbedBuilder()
      .setDescription("> **Please choice the category for your ticket**")
      .setColor('Blurple')
      .setTimestamp()
      const menu = new StringSelectMenuBuilder()
      .setCustomId('category_select')
      .setPlaceholder('Select a category')
      .addOptions([
        new StringSelectMenuOptionBuilder()
        .setLabel('Buy Product')
        .setValue('buy_product')
        .setDescription('Select this option if you want to buy a product')
        .setEmoji('💸'),
        new StringSelectMenuOptionBuilder()
        .setLabel('Support')
        .setValue('support')
        .setDescription('Select this option if you need support')
        .setEmoji('🛠️'),
      ])
      const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(menu)
      const reply = await interaction.editReply({ embeds: [embed], components: [actionRow] });
       
      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.user.id === interaction.user.id && i.customId === 'category_select',
        time: 60000,
      })

      collector.on('collect', async (inter: StringSelectMenuInteraction) => {
        const category = inter.values[0];
        if (category === 'buy_product') {
          await createBuyTicket(inter);
        } else if (category === 'support') {
          await SupportTicketMoal(inter);
        }
      })

    } catch (error) {
        console.error('Failed to defer reply:', error);
        await interaction.editReply({ content: "Internal Server Error" });
    }
  };
  

export default createTicketButton;