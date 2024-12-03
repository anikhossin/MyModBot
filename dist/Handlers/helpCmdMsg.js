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
const discord_js_1 = require("discord.js");
const GeneralHelp = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('General Commands')
        .setColor('Blurple')
        .setTimestamp()
        .setFooter({ text: 'system codded by @dev_anik' })
        .setDescription(`\`/help\` - Shows the help menu\n` +
        `\`/ping\` - Shows the bot's latency\n` +
        `\`/echo\` - Repeats the message you provide (Admin only)\n` +
        `\`/setupbot\` - Sets up the bot\n`);
    yield interaction.reply({ embeds: [embed], ephemeral: true });
});
const ModerationHelp = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    yield interaction.reply({ content: "Moderation commands are not available yet", ephemeral: true });
});
const FunHelp = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    yield interaction.reply({ content: "Fun commands are not available yet", ephemeral: true });
});
const UtilityHelp = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('Utility Commands')
        .setColor('Blurple')
        .setTimestamp()
        .setFooter({ text: 'system codded by @dev_anik' })
        .setDescription(`\`/ticketpanel\` - Creates a ticket panel\n`);
    yield interaction.reply({ embeds: [embed], ephemeral: true });
});
const HelpMsg = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const infoEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(`Help Menu`)
        .setURL("https://anikhossin.xyz/")
        .setColor('Blurple')
        .setDescription("🎉 **Hey there!** 👋  \n Your friendly little bot created during my developer's practice sessions. 🛠️ My purpose is simple: to assist, learn, and grow while showing off my developer's skills! 🚀  \n\n🔍 **About Me**  \n✨ **Language**: My code is crafted with ❤️ in **TypeScript**.  \n📚 **Library**: I run on the powerful **Discord.js** framework.  \n⚡ **What I Do**: I'm here to help your server with some extra features.\n\n📜 **Command List**  \nUse the dropdown menu below to see everything I can do! ⬇️  \n🔧 Whether it's for testing, experimenting, or helping out, I've got something for everyone. \n\n💡 **Connect with my Developer**  \n🖥️ **Creator**: *Dev Anik*  \n- 🔗 **Telegram**: [@dev_anik](https://t.me/dev_anik)  \n- 💬 **Discord**: `@dev_anik`  \n\n✨ Let’s make your Discord experience awesome! Don’t forget to share feedback with my creator. 😊")
        .setFooter({ text: 'system codded by @dev_anik' })
        .setTimestamp();
    const manu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId('help_select')
        .setPlaceholder('Select a category')
        .addOptions([
        new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel('General')
            .setValue('general')
            .setDescription('General commands')
            .setEmoji('📜'),
        new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel('Moderation')
            .setValue('moderation')
            .setDescription('Moderation commands')
            .setEmoji('🛠️'),
        new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel('Fun')
            .setValue('fun')
            .setDescription('Fun commands')
            .setEmoji('🎉'),
        new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel('Utility')
            .setValue('utility')
            .setDescription('Utility commands')
            .setEmoji('🔧'),
    ]);
    const actionRow = new discord_js_1.ActionRowBuilder().addComponents(manu);
    const reply = yield msg.reply({ embeds: [infoEmbed], components: [actionRow] });
    const collector = reply.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.StringSelect,
        filter: (i) => i.user.id === msg.author.id && i.customId === 'help_select',
        time: 60000
    });
    collector.on('collect', (inter) => __awaiter(void 0, void 0, void 0, function* () {
        const category = inter.values[0];
        if (category === 'general') {
            yield GeneralHelp(inter);
        }
        else if (category === 'moderation') {
            yield ModerationHelp(inter);
        }
        else if (category === 'fun') {
            yield FunHelp(inter);
        }
        else if (category === 'utility') {
            yield UtilityHelp(inter);
        }
    }));
    collector.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        const newmenu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('help_select')
            .setPlaceholder('Select a category')
            .setDisabled(true)
            .addOptions([
            new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel('General')
                .setValue('general')
                .setDescription('General commands')
                .setEmoji('📜'),
            new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel('Moderation')
                .setValue('moderation')
                .setDescription('Moderation commands')
                .setEmoji('🛠️'),
            new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel('Fun')
                .setValue('fun')
                .setDescription('Fun commands')
                .setEmoji('🎉'),
            new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel('Utility')
                .setValue('utility')
                .setDescription('Utility commands')
                .setEmoji('🔧'),
        ]);
        const newactionRow = new discord_js_1.ActionRowBuilder().addComponents(newmenu);
        yield reply.edit({ embeds: [infoEmbed], components: [newactionRow] });
    }));
});
exports.default = HelpMsg;
//# sourceMappingURL=helpCmdMsg.js.map