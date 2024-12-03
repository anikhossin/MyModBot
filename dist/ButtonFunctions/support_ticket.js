"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ConfigCaller_1 = __importDefault(require("../Handlers/ConfigCaller"));
const SupportTicketMoal = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modal = new discord_js_1.ModalBuilder()
            .setTitle('Support Ticket')
            .setCustomId('support_ticket_modal');
        const Issue = new discord_js_1.TextInputBuilder()
            .setCustomId('issue')
            .setLabel('What is your issue?')
            .setPlaceholder('Enter your issue')
            .setStyle(discord_js_1.TextInputStyle.Paragraph)
            .setRequired(true);
        const IssueComponent = new discord_js_1.ActionRowBuilder().addComponents(Issue);
        modal.addComponents(IssueComponent);
        yield interaction.showModal(modal);
        let issue;
        const filter = (interaction) => interaction.customId === 'support_ticket_modal' && interaction.user.id === interaction.user.id;
        interaction
            .awaitModalSubmit({ filter, time: 60000 })
            .then((inter) => __awaiter(void 0, void 0, void 0, function* () {
            issue = inter.fields.getTextInputValue('issue');
            if (issue.length > 1024) {
                yield inter.reply({ content: 'Issue is too long. Please keep it under 1024 characters.', ephemeral: true });
                return;
            }
            yield inter.deferReply({ ephemeral: true });
            yield inter.editReply({ content: 'Creating ticket...', components: [] });
            yield ticketCreation(inter, issue);
        }))
            .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
            console.error('Failed to await modal:', error);
            yield interaction.editReply({ content: 'Failed to await modal', components: [] });
        }));
    }
    catch (error) {
        console.error('Failed to defer reply:', error);
        yield interaction.editReply({ content: "Internal Server Error" });
    }
});
exports.default = SupportTicketMoal;
const ticketCreation = (interaction, issue) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const ConfigData = (0, ConfigCaller_1.default)();
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
    const category = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.fetch(category_id));
    if (!category || category.type !== discord_js_1.ChannelType.GuildCategory) {
        return interaction.editReply({
            content: 'Ticket category not found. Please contact an administrator.',
        });
    }
    const support_role = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.get(support_role_id);
    if (!support_role) {
        return interaction.editReply({
            content: 'Support role not found. Please contact an administrator.',
        });
    }
    const existingTicket = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.channels.cache.find((channel) => channel.type === discord_js_1.ChannelType.GuildText &&
        channel.parentId === category.id &&
        channel.name === `ticket-${interaction.user.id}`);
    if (existingTicket) {
        return interaction.editReply({
            content: `You already have an open ticket: ${existingTicket.toString()}`,
            components: [],
            embeds: []
        });
    }
    const ticketChannel = yield ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.channels.create({
        name: `ticket-${interaction.user.id}`,
        type: discord_js_1.ChannelType.GuildText,
        parent: category,
        topic: `${(_e = interaction.user) === null || _e === void 0 ? void 0 : _e.id}`,
        permissionOverwrites: [
            {
                id: interaction.user.id,
                allow: [discord_js_1.PermissionFlagsBits.ViewChannel, discord_js_1.PermissionFlagsBits.SendMessages],
            },
            {
                id: (_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.roles.everyone.id,
                deny: [discord_js_1.PermissionFlagsBits.ViewChannel],
            },
            {
                id: support_role.id,
                allow: [discord_js_1.PermissionFlagsBits.ViewChannel, discord_js_1.PermissionFlagsBits.SendMessages],
            },
        ],
    }));
    const ticketEmbed = new discord_js_1.EmbedBuilder()
        .setTitle('Support Ticket')
        .setDescription(`> **Issue:**\n\`${issue}\``)
        .setColor('Blurple')
        .setTimestamp()
        .setThumbnail(((_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.iconURL()) || null);
    const button = new discord_js_1.ButtonBuilder()
        .setLabel('Close Ticket')
        .setStyle(discord_js_1.ButtonStyle.Danger)
        .setCustomId('close_ticket');
    const actionRow = new discord_js_1.ActionRowBuilder()
        .addComponents(button);
    yield (ticketChannel === null || ticketChannel === void 0 ? void 0 : ticketChannel.send({ content: `<@${interaction.user.id}> <@&${support_role.id}>`, components: [actionRow], embeds: [ticketEmbed] }));
    yield interaction.editReply({ content: `Ticket created: ${ticketChannel === null || ticketChannel === void 0 ? void 0 : ticketChannel.toString()}`, components: [], embeds: [] });
});
//# sourceMappingURL=support_ticket.js.map