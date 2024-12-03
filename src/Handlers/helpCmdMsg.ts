import { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuInteraction, ActionRow, ActionRowBuilder, ComponentType, Message} from "discord.js";


const GeneralHelp = async (interaction: StringSelectMenuInteraction) => {
    const embed = new EmbedBuilder()
    .setTitle('General Commands')
    .setColor('Blurple')
    .setTimestamp()
    .setFooter({ text: 'system codded by @dev_anik' })
    .setDescription(
        `\`/help\` - Shows the help menu\n` +
        `\`/ping\` - Shows the bot's latency\n` +
        `\`/echo\` - Repeats the message you provide (Admin only)\n` +
        `\`/setupbot\` - Sets up the bot\n` 
    );
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

const ModerationHelp = async (interaction: StringSelectMenuInteraction) => {
    await interaction.reply({ content: "Moderation commands are not available yet", ephemeral: true });
}

const FunHelp = async (interaction: StringSelectMenuInteraction) => {
    await interaction.reply({ content: "Fun commands are not available yet", ephemeral: true });
}

const UtilityHelp = async (interaction: StringSelectMenuInteraction) => {
    const embed = new EmbedBuilder()
    .setTitle('Utility Commands')
    .setColor('Blurple')
    .setTimestamp()
    .setFooter({ text: 'system codded by @dev_anik' })
    .setDescription(
        `\`/ticketpanel\` - Creates a ticket panel\n` 
    );
    await interaction.reply({ embeds: [embed], ephemeral: true });
}


const HelpMsg = async (msg : Message) => {
    const infoEmbed = new EmbedBuilder()
    .setTitle(`Help Menu`)
    .setURL("https://anikhossin.xyz/")
    .setColor('Blurple')
    .setDescription("🎉 **Hey there!** 👋  \n Your friendly little bot created during my developer's practice sessions. 🛠️ My purpose is simple: to assist, learn, and grow while showing off my developer's skills! 🚀  \n\n🔍 **About Me**  \n✨ **Language**: My code is crafted with ❤️ in **TypeScript**.  \n📚 **Library**: I run on the powerful **Discord.js** framework.  \n⚡ **What I Do**: I'm here to help your server with some extra features.\n\n📜 **Command List**  \nUse the dropdown menu below to see everything I can do! ⬇️  \n🔧 Whether it's for testing, experimenting, or helping out, I've got something for everyone. \n\n💡 **Connect with my Developer**  \n🖥️ **Creator**: *Dev Anik*  \n- 🔗 **Telegram**: [@dev_anik](https://t.me/dev_anik)  \n- 💬 **Discord**: `@dev_anik`  \n\n✨ Let’s make your Discord experience awesome! Don’t forget to share feedback with my creator. 😊")
    .setFooter({ text: 'system codded by @dev_anik' })
    .setTimestamp();

    const manu = new StringSelectMenuBuilder()
    .setCustomId('help_select')
    .setPlaceholder('Select a category')
    .addOptions([
        new StringSelectMenuOptionBuilder()
        .setLabel('General')
        .setValue('general')
        .setDescription('General commands')
        .setEmoji('📜'),
        new StringSelectMenuOptionBuilder()
        .setLabel('Moderation')
        .setValue('moderation')
        .setDescription('Moderation commands')
        .setEmoji('🛠️'),
        new StringSelectMenuOptionBuilder()
        .setLabel('Fun')
        .setValue('fun')
        .setDescription('Fun commands')
        .setEmoji('🎉'),
        new StringSelectMenuOptionBuilder()
        .setLabel('Utility')
        .setValue('utility')
        .setDescription('Utility commands')
        .setEmoji('🔧'),
    ])
    const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(manu);
    const reply = await msg.reply({ embeds: [infoEmbed], components: [actionRow] });

    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.user.id === msg.author.id && i.customId === 'help_select',
        time: 60_000
    })

    collector.on('collect', async (inter: StringSelectMenuInteraction) => {
        const category = inter.values[0];
        if (category === 'general') {
            await GeneralHelp(inter);
        } else if (category === 'moderation') {
            await ModerationHelp(inter);
        } else if (category === 'fun') {
            await FunHelp(inter);
        } else if (category === 'utility') {
            await UtilityHelp(inter);
        }
    })
    collector.on('end', async () => {
        const newmenu = new StringSelectMenuBuilder()
        .setCustomId('help_select')
        .setPlaceholder('Select a category')
        .setDisabled(true)
        .addOptions([
            new StringSelectMenuOptionBuilder()
            .setLabel('General')
            .setValue('general')
            .setDescription('General commands')
            .setEmoji('📜'),
            new StringSelectMenuOptionBuilder()
            .setLabel('Moderation')
            .setValue('moderation')
            .setDescription('Moderation commands')
            .setEmoji('🛠️'),
            new StringSelectMenuOptionBuilder()
            .setLabel('Fun')
            .setValue('fun')
            .setDescription('Fun commands')
            .setEmoji('🎉'),
            new StringSelectMenuOptionBuilder()
            .setLabel('Utility')
            .setValue('utility')
            .setDescription('Utility commands')
            .setEmoji('🔧'),
        ])
        const newactionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(newmenu);
        await reply.edit({ embeds: [infoEmbed], components: [newactionRow] });
    })
}

export default HelpMsg;