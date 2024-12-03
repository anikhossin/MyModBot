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
exports.setupBot = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.setupBot = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('setupbot')
        .setDescription('Sets up the bot')
        .setDefaultMemberPermissions(0)
        .addChannelOption(option => option
        .setName('ticket-category')
        .setDescription('The category to open tickets in')
        .setRequired(true))
        .addRoleOption(option => option
        .setName('support-role')
        .setDescription('The role to give to support staff')
        .setRequired(true))
        .addChannelOption(option => option
        .setName('welcome-channel')
        .setDescription('The channel to send welcome messages to')
        .setRequired(false))
        .addChannelOption(option => option
        .setName('ticket-transcript')
        .setDescription('The channel to send ticket transcripts to')
        .setRequired(false)),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const selectedChannel = interaction.options.getChannel('ticket-category', true);
        const supportRole = interaction.options.getRole('support-role', true);
        const welcomeChannel = interaction.options.getChannel('welcome-channel', false);
        const ticketTranscript = interaction.options.getChannel('ticket-transcript', false);
        if (selectedChannel.type !== discord_js_1.ChannelType.GuildCategory) {
            yield interaction.reply({ content: 'Please select a category for the ticket category', ephemeral: true });
            return;
        }
        if ((welcomeChannel === null || welcomeChannel === void 0 ? void 0 : welcomeChannel.type) !== discord_js_1.ChannelType.GuildText) {
            yield interaction.reply({ content: 'Please select a text channel for the welcome channel', ephemeral: true });
            return;
        }
        if ((ticketTranscript === null || ticketTranscript === void 0 ? void 0 : ticketTranscript.type) !== discord_js_1.ChannelType.GuildText) {
            yield interaction.reply({ content: 'Please select a text channel for the ticket transcript channel', ephemeral: true });
            return;
        }
        const configFilePath = path_1.default.join(__dirname, '..', '..', 'BotConfig.json');
        const config = {
            ticketCategory: selectedChannel.id,
            supportRole: supportRole.id,
            welcomeChannel: welcomeChannel.id,
            ticketTranscript: ticketTranscript.id,
        };
        fs_1.default.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
        yield interaction.reply({ content: 'Bot setup complete', ephemeral: true });
    })
};
module.exports = exports.setupBot;
//# sourceMappingURL=setupBot.js.map