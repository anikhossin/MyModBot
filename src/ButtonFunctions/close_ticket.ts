import { ButtonInteraction, ButtonBuilder, ActionRow, ButtonStyle, ActionRowBuilder, EmbedBuilder, TextChannel } from 'discord.js';
import * as discordTranscripts from 'discord-html-transcripts';
import GetConfig from '../Handlers/ConfigCaller';


const closeTicket = async (interaction: ButtonInteraction) => {
    try {
        await interaction.deferReply({ ephemeral: false });
        const msg = await interaction.isButton() ? interaction.message : await interaction.fetchReply();
        
        const button = new ButtonBuilder()
        .setCustomId('close_ticket_disabled')
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true);
        const actionRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(button);
        await msg.edit({ components: [actionRow] });


        const config = GetConfig();
        const logChannel = interaction.guild?.channels.cache.get(config.ticketTranscript);
        if (!logChannel) {
            return interaction.editReply({
                content: 'Transcript channel not found. Please contact an administrator.',
            });
        }
        const transcript = await discordTranscripts.createTranscript(interaction.channel as any);
        const logembed = new EmbedBuilder()
        .setTitle('Ticket Transcript')
        .setDescription(`> Your ticket at **${interaction.guild?.name}** has been closed by ${interaction.user.tag}.\n> Here the transcript of your ticket attached below.`)
        .setColor('DarkButNotBlack')
        .setTimestamp()
        .setThumbnail(interaction.guild?.iconURL() || null)
        .setFooter({ text: 'system codded by @dev_anik'});

        const opener_id = (interaction.channel as TextChannel)?.topic;
        const opener = interaction.guild?.members.cache.get(opener_id as string);

        if (opener) {
            try {
                await opener.send({ embeds: [logembed], files: [transcript] });
            } catch (error) {
            }
        }

        await (logChannel as TextChannel).send({ embeds: [logembed], files: [transcript] });

        await interaction.followUp({content: `Logged the transcript and sent to ${opener?.user.tag}`, ephemeral: false});

        const currentTime = new Date()
        currentTime.toLocaleDateString();

        const thirty_sec_timestamp = currentTime.getTime() / 1000 + 30;
        const thirty_sec_timestamp_str = `<t:${Math.floor(thirty_sec_timestamp)}:R>`;
        await interaction.followUp({ content: `Ticket will be closed ${thirty_sec_timestamp_str}`, ephemeral: false });
        setTimeout(async () => {
            await interaction.channel?.delete();
        }, 30000);

    } catch (error) {
        console.error('Failed to defer reply:', error);
        await interaction.editReply({ content: "Internal Server Error" });
    }
}

export default closeTicket;