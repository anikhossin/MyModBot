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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketPanel = void 0;
const discord_js_1 = require("discord.js");
exports.TicketPanel = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('ticketpanel')
        .setDescription('Creates a ticket panel'),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (!interaction.channel || !(interaction.channel instanceof discord_js_1.TextChannel)) {
            yield interaction.reply({ content: 'This command can only be used in a text channel.', ephemeral: true });
            return;
        }
        yield interaction.reply({ content: 'Please provide the title for the ticket panel embed:', ephemeral: false });
        const filter = (response) => response.author.id === interaction.user.id;
        const titleCollector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });
        titleCollector.on('collect', (titleMessage) => __awaiter(void 0, void 0, void 0, function* () {
            const title = titleMessage.content;
            if (title.length > 10) {
                yield interaction.followUp({ content: 'Title is too long. Please keep it under 256 characters.', ephemeral: true });
                return;
            }
            yield interaction.followUp({ content: 'Now, provide the description for the ticket panel embed:', ephemeral: false });
            const descriptionCollector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });
            descriptionCollector.on('collect', (descMessage) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const description = descMessage.content;
                if (description.length > 1024) {
                    yield interaction.followUp({ content: 'Description is too long. Please keep it under 1024 characters.', ephemeral: true });
                    return;
                }
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor('Blurple')
                    .setTimestamp()
                    .setThumbnail(((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.iconURL()) || '')
                    .setFooter({ text: 'system codded by @dev_anik' });
                const button = new discord_js_1.ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('Create Ticket')
                    .setStyle(discord_js_1.ButtonStyle.Primary);
                const actionRow = new discord_js_1.ActionRowBuilder().addComponents(button);
                yield interaction.channel.send({
                    embeds: [embed],
                    components: [actionRow],
                });
                yield interaction.followUp({ content: 'Ticket panel created successfully!', ephemeral: true });
                descriptionCollector.stop();
            }));
            descriptionCollector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    interaction.followUp({ content: 'You took too long to provide the description. Please try again.', ephemeral: true });
                }
            });
            titleCollector.stop();
        }));
        titleCollector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.followUp({ content: 'You took too long to provide the title. Please try again.', ephemeral: true });
            }
        });
    }),
};
module.exports = exports.TicketPanel;
//# sourceMappingURL=TicketPanel.js.map