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
const slashCommandHandler_1 = require("./Handlers/slashCommandHandler");
const config_json_1 = require("../config.json");
const create_ticket_button_1 = __importDefault(require("./ButtonFunctions/create_ticket_button"));
const close_ticket_1 = __importDefault(require("./ButtonFunctions/close_ticket"));
const ConfigCaller_1 = __importDefault(require("./Handlers/ConfigCaller"));
const helpCmdMsg_1 = __importDefault(require("./Handlers/helpCmdMsg"));
const client = new discord_js_1.Client({ intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.GuildMessageTyping,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildPresences,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildInvites,
        discord_js_1.GatewayIntentBits.GuildIntegrations,
        discord_js_1.GatewayIntentBits.GuildWebhooks,
        discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
        discord_js_1.GatewayIntentBits.GuildMessageTyping,
        discord_js_1.GatewayIntentBits.MessageContent,
    ] });
const commands = (0, slashCommandHandler_1.loadCommands)();
client.once('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
    yield ((_b = client.user) === null || _b === void 0 ? void 0 : _b.setActivity('Mention me for help', { type: discord_js_1.ActivityType.Listening }));
    yield ((_c = client.user) === null || _c === void 0 ? void 0 : _c.setStatus('idle'));
    yield (0, slashCommandHandler_1.registerCommands)(config_json_1.client_id, config_json_1.token);
}));
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isChatInputCommand())
        return;
    const command = commands.find((cmd) => cmd.data.name === interaction.commandName);
    if (!command) {
        console.error(`Command ${interaction.commandName} not found.`);
        return;
    }
    try {
        yield command.execute(interaction);
    }
    catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);
        yield interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
}));
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isButton())
        return;
    if (interaction.customId === 'create_ticket') {
        yield (0, create_ticket_button_1.default)(interaction);
    }
    else if (interaction.customId === 'close_ticket') {
        yield (0, close_ticket_1.default)(interaction);
    }
}));
client.on('guildMemberAdd', (member) => __awaiter(void 0, void 0, void 0, function* () {
    const config = (0, ConfigCaller_1.default)();
    const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannel);
    if (!welcomeChannel)
        return;
    const totalGuildMembers = member.guild.memberCount;
    const embed = new discord_js_1.EmbedBuilder()
        .setDescription(`> Welcome to ${member.guild.name}, ${member.user}! You are the ${totalGuildMembers}th member.\n` +
        `> We hope you enjoy your stay here.`)
        .setColor('Blurple')
        .setTimestamp()
        .setFooter({ text: 'system codded by @dev_anik' });
    yield welcomeChannel.send({ embeds: [embed] });
}));
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (message.content === `<@${(_a = client.user) === null || _a === void 0 ? void 0 : _a.id}>` || message.content === `<@!${(_b = client.user) === null || _b === void 0 ? void 0 : _b.id}>`) {
        yield (0, helpCmdMsg_1.default)(message);
    }
}));
client.login(config_json_1.token);
//# sourceMappingURL=index.js.map