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
exports.echo = void 0;
const discord_js_1 = require("discord.js");
exports.echo = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input')
        .addStringOption(option => option.setName('input').setDescription('The input to echo').setRequired(true))
        .setDefaultMemberPermissions(0),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.isTextBased()) && interaction.channel.type === discord_js_1.ChannelType.GuildText) {
            const input = interaction.options.getString('input') || 'No input provided';
            yield interaction.channel.send({ content: input });
            yield interaction.reply({ content: 'Message sent', ephemeral: true });
        }
        else {
            yield interaction.reply({ content: 'This command can only be used in a server text channel', ephemeral: true });
        }
    })
};
module.exports = exports.echo;
//# sourceMappingURL=echo.js.map