import { EmbedBuilder, AttachmentBuilder } from 'discord.js'
import { BotEmbed } from '../types'

export default function(): BotEmbed {

    return {
        embeds: [
            new EmbedBuilder()
                .setColor('#6aaa64')
                .setTitle('Processing Complete')
                .setImage(`attachment://stable-confusion.jpeg`)
                .setTimestamp()
                
        ]
    }
}
