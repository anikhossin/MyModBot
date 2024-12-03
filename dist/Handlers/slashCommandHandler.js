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
exports.registerCommands = exports.loadCommands = void 0;
const rest_1 = require("@discordjs/rest");
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commands = [];
const loadCommands = () => {
    const commandFiles = fs_1.default
        .readdirSync(path_1.default.join(__dirname, '../SlashCmds'))
        .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../SlashCmds/${file}`);
        commands.push(command);
    }
    return commands;
};
exports.loadCommands = loadCommands;
const registerCommands = (clientId, token, guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const rest = new rest_1.REST({ version: '10' }).setToken(token);
    const slashCommands = commands.map((cmd) => cmd.data.toJSON());
    try {
        if (guildId) {
            yield rest.put(discord_js_1.Routes.applicationGuildCommands(clientId, guildId), {
                body: slashCommands,
            });
            console.log('Successfully registered guild slash commands.');
        }
        else {
            yield rest.put(discord_js_1.Routes.applicationCommands(clientId), {
                body: slashCommands,
            });
            console.log('Successfully registered global slash commands.');
        }
    }
    catch (error) {
        console.error('Error registering slash commands:', error);
    }
});
exports.registerCommands = registerCommands;
//# sourceMappingURL=slashCommandHandler.js.map