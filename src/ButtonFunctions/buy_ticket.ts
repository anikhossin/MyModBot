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


const createBuyTicket = async (interaction: StringSelectMenuInteraction) => {
    const Modal = new ModalBuilder()
    .setTitle('Buy Product Ticket')
    .setCustomId('buy_product_ticket');

    const ProductName = new TextInputBuilder()
    .setCustomId('product_name')
    .setLabel('What product are you looking to buy?')
    .setPlaceholder('Enter the product name')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);
    const ExtraInfo = new TextInputBuilder()
    .setCustomId('extra_info')
    .setLabel('Any extra things you want to mention?')
    .setPlaceholder('Enter any extra information')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);
    const PaymentMethod = new TextInputBuilder()
    .setCustomId('payment_method')
    .setLabel('What payment method are you using?')
    .setPlaceholder('Enter the payment method')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    const ProductNameComponent = new ActionRowBuilder<TextInputBuilder>().addComponents(ProductName);
    const ExtraInfoComponent = new ActionRowBuilder<TextInputBuilder>().addComponents(ExtraInfo);
    const PaymentMethodComponent = new ActionRowBuilder<TextInputBuilder>().addComponents(PaymentMethod);

    Modal.addComponents(ProductNameComponent, PaymentMethodComponent, ExtraInfoComponent);

    try {
        await interaction.showModal(Modal);

    } catch (error) {
        console.error('Failed to defer reply:', error);
        await interaction.editReply({ content: "Internal Server Error" });
    }

    let product_name: string | undefined;
    let payment_method: string | undefined;
    let extra_info: string | undefined;

    const filter = (interaction: ModalSubmitInteraction) => interaction.customId === 'buy_product_ticket' && interaction.user.id === interaction.user.id;

    interaction
    .awaitModalSubmit({ filter, time: 60000 })
    .then(async (inter) => {
        product_name = inter.fields.getTextInputValue('product_name');
        payment_method = inter.fields.getTextInputValue('payment_method');
        extra_info = inter.fields.getTextInputValue('extra_info') || 'Noting Extra Needed';
        await inter.deferReply({ ephemeral: true });
        await inter.editReply({ content: 'Creating ticket...', components: [], embeds: [] });
        await ticketCreation(inter, product_name!, payment_method!, extra_info!);
    })
    .catch(async (error) => {
        console.error('Failed to defer reply:', error);
        await interaction.editReply({ content: "Internal Server Error" });
    });
    
}

export default createBuyTicket;

const ticketCreation = async (interaction: ModalSubmitInteraction, product_name: string,payment_method: string, extra_info: string  ) => {
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
            }
        ],

    })
    const ticketEmbed = new EmbedBuilder()
    .setTitle('Buy Product Ticket')
    .setDescription(`> **Product Name:** ${product_name}\n> **Payment Method:** ${payment_method}\n> **Extra Info:** ${extra_info}`)
    .setColor('Blurple')
    .setTimestamp()
    .setThumbnail(interaction.guild?.iconURL()! || null)
    const button = new ButtonBuilder()
    .setLabel('Close Ticket')
    .setStyle(ButtonStyle.Danger)
    .setCustomId('close_ticket')
    const actionRow =  new ActionRowBuilder<ButtonBuilder>()
    .addComponents(button);
    await ticketChannel?.send({content: `<@${interaction.user.id}> <@&${support_role.id}>`, components: [actionRow], embeds: [ticketEmbed]});

    await interaction.editReply({ content: `Ticket created: ${ticketChannel?.toString()}`, components: [], embeds: [] });
}