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
const buy_ticket_1 = __importDefault(require("./buy_ticket"));
const support_ticket_1 = __importDefault(require("./support_ticket"));
const ConfigCaller_1 = __importDefault(require("../Handlers/ConfigCaller"));
const createTicketButton = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield interaction.deferReply({ ephemeral: true });
        const config = (0, ConfigCaller_1.default)();
        const ticketCategory = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(config.ticketCategory);
        if (!ticketCategory) {
            return interaction.editReply({
                content: 'Bot configuration error. Please contact an administrator.',
            });
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription("> **Please choice the category for your ticket**")
            .setColor('Blurple')
            .setTimestamp();
        const menu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('category_select')
            .setPlaceholder('Select a category')
            .addOptions([
            new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel('Buy Product')
                .setValue('buy_product')
                .setDescription('Select this option if you want to buy a product')
                .setEmoji('💸'),
            new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel('Support')
                .setValue('support')
                .setDescription('Select this option if you need support')
                .setEmoji('🛠️'),
        ]);
        const actionRow = new discord_js_1.ActionRowBuilder()
            .addComponents(menu);
        const reply = yield interaction.editReply({ embeds: [embed], components: [actionRow] });
        const collector = reply.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.StringSelect,
            filter: (i) => i.user.id === interaction.user.id && i.customId === 'category_select',
            time: 60000,
        });
        collector.on('collect', (inter) => __awaiter(void 0, void 0, void 0, function* () {
            const category = inter.values[0];
            if (category === 'buy_product') {
                yield (0, buy_ticket_1.default)(inter);
            }
            else if (category === 'support') {
                yield (0, support_ticket_1.default)(inter);
            }
        }));
    }
    catch (error) {
        console.error('Failed to defer reply:', error);
        yield interaction.editReply({ content: "Internal Server Error" });
    }
});
exports.default = createTicketButton;
//# sourceMappingURL=create_ticket_button.js.map