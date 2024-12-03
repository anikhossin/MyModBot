"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const discordTranscripts = __importStar(require("discord-html-transcripts"));
const ConfigCaller_1 = __importDefault(require("../Handlers/ConfigCaller"));
const closeTicket = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        yield interaction.deferReply({ ephemeral: false });
        const msg = (yield interaction.isButton()) ? interaction.message : yield interaction.fetchReply();
        const button = new discord_js_1.ButtonBuilder()
            .setCustomId('close_ticket_disabled')
            .setLabel('Close Ticket')
            .setStyle(discord_js_1.ButtonStyle.Danger)
            .setDisabled(true);
        const actionRow = new discord_js_1.ActionRowBuilder()
            .addComponents(button);
        yield msg.edit({ components: [actionRow] });
        const config = (0, ConfigCaller_1.default)();
        const logChannel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(config.ticketTranscript);
        if (!logChannel) {
            return interaction.editReply({
                content: 'Transcript channel not found. Please contact an administrator.',
            });
        }
        const transcript = yield discordTranscripts.createTranscript(interaction.channel);
        const logembed = new discord_js_1.EmbedBuilder()
            .setTitle('Ticket Transcript')
            .setDescription(`> Your ticket at **${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.name}** has been closed by ${interaction.user.tag}.\n> Here the transcript of your ticket attached below.`)
            .setColor('DarkButNotBlack')
            .setTimestamp()
            .setThumbnail(((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.iconURL()) || null)
            .setFooter({ text: 'system codded by @dev_anik' });
        const opener_id = (_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.topic;
        const opener = (_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.members.cache.get(opener_id);
        if (opener) {
            try {
                yield opener.send({ embeds: [logembed], files: [transcript] });
            }
            catch (error) {
            }
        }
        yield logChannel.send({ embeds: [logembed], files: [transcript] });
        yield interaction.followUp({ content: `Logged the transcript and sent to ${opener === null || opener === void 0 ? void 0 : opener.user.tag}`, ephemeral: false });
        const currentTime = new Date();
        currentTime.toLocaleDateString();
        const thirty_sec_timestamp = currentTime.getTime() / 1000 + 30;
        const thirty_sec_timestamp_str = `<t:${Math.floor(thirty_sec_timestamp)}:R>`;
        yield interaction.followUp({ content: `Ticket will be closed ${thirty_sec_timestamp_str}`, ephemeral: false });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.delete());
        }), 30000);
    }
    catch (error) {
        console.error('Failed to defer reply:', error);
        yield interaction.editReply({ content: "Internal Server Error" });
    }
});
exports.default = closeTicket;
//# sourceMappingURL=close_ticket.js.map