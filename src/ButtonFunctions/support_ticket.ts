import {
    EmbedBuilder,
    StringSelectMenuInteraction,
    ActionRowBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    ButtonBuilder,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    ModalSubmitInteraction,
    TextInputStyle
} from 'discord.js';

import GetConfig from '../Handlers/ConfigCaller';

const SupportTicketMoal = async (interaction: StringSelectMenuInteraction) => {
    try {
        const modal = new ModalBuilder()
        .setTitle('Support Ticket')
        .setCustomId('support_ticket_modal');
        const Issue = new TextInputBuilder()
        .setCustomId('issue')
        .setLabel('What is your issue?')
        .setPlaceholder('Enter your issue')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

        const IssueComponent = new ActionRowBuilder<TextInputBuilder>().addComponents(Issue);
        modal.addComponents(IssueComponent);
        await interaction.showModal(modal);
        
        let issue: string | undefined;

        const filter = (interaction: ModalSubmitInteraction) => interaction.customId === 'support_ticket_modal' && interaction.user.id === interaction.user.id;
        
        interaction
        .awaitModalSubmit({ filter, time: 60000 })
        .then(async (inter) => {
            issue = inter.fields.getTextInputValue('issue');
            if (issue.length > 1024) {
                await inter.reply({ content: 'Issue is too long. Please keep it under 1024 characters.', ephemeral: true });
                return;
            }
            await inter.deferReply({ ephemeral: true });
            await inter.editReply({ content: 'Creating ticket...', components: [] });
            await ticketCreation(inter, issue!);
        })
        .catch(async (error) => {
            console.error('Failed to await modal:', error);
            await interaction.editReply({ content: 'Failed to await modal', components: [] });
        });

    } catch (error) {
        console.error('Failed to defer reply:', error);
        await interaction.editReply({ content: "Internal Server Error" });
    }
}

export default SupportTicketMoal;


const ticketCreation = async (interaction: ModalSubmitInteraction, issue: string  ) => {
    const ConfigData = GetConfig();
    const category_id = ConfigData.ticketCategory;
    if (!category_id) {
        return interaction.editReply({
          content: 'Ticket category not found. Please contact an administrator.',
        });
    }
    const support_role_id = ConfigData.supportRole;
    if (!support_role_id) {
        return interaction.editReply({
          content: 'Support role not found. Please contact an administrator.',
        });
    }
    
    const category = await interaction.guild?.channels.fetch(category_id);
    if (!category || category.type !== ChannelType.GuildCategory) {
        return interaction.editReply({
          content: 'Ticket category not found. Please contact an administrator.',
        });
    }
    const support_role = interaction.guild?.roles.cache.get(support_role_id);
    if (!support_role) {
        return interaction.editReply({
          content: 'Support role not found. Please contact an administrator.',
        });
    }
    const existingTicket = interaction.guild?.channels.cache.find(
        (channel) =>
          channel.type === ChannelType.GuildText &&
          channel.parentId === category.id &&
          channel.name === `ticket-${interaction.user.id}`
      );
  
      if (existingTicket) {
        return interaction.editReply({
          content: `You already have an open ticket: ${existingTicket.toString()}`,
          components: [],
          embeds: []
        });
      }

    const ticketChannel = await interaction.guild?.channels.create({
        name: `ticket-${interaction.user.id}`,
        type: ChannelType.GuildText,
        parent: category,
        topic: `${interaction.user?.id}`,
        permissionOverwrites: [
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
            {
                id: interaction.guild?.roles.everyone.id!,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: support_role.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
        ],

    })
    const ticketEmbed = new EmbedBuilder()
    .setTitle('Support Ticket')
    .setDescription(`> **Issue:**\n\`${issue}\``)
    .setColor('Blurple')
    .setTimestamp()
    .setThumbnail(interaction.guild?.iconURL() || null);
    const button = new ButtonBuilder()
    .setLabel('Close Ticket')
    .setStyle(ButtonStyle.Danger)
    .setCustomId('close_ticket')
    const actionRow =  new ActionRowBuilder<ButtonBuilder>()
    .addComponents(button);
    await ticketChannel?.send({content: `<@${interaction.user.id}> <@&${support_role.id}>`, components: [actionRow], embeds: [ticketEmbed]});

    await interaction.editReply({ content: `Ticket created: ${ticketChannel?.toString()}`, components: [], embeds: [] });
}