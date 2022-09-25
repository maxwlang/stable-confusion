import { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } from 'discord.js'
import { BotEmbed, QueueItem } from '../types'

export default function(queueItem: QueueItem): BotEmbed {
    return {
        embeds: [
            new EmbedBuilder()
                .setColor('#6aaa64')
                .setTitle('Pick An Image')
                .setDescription('Select an image with the dropdown below.')
                .setTimestamp()
                .setImage(`attachment://stable-confusion_${queueItem.uuid}_collage.png`)
        ],
        components: [
            new ActionRowBuilder()
                .addComponents([
                    new SelectMenuBuilder()
                        .setCustomId(`image-select-prompt-${queueItem.type}`)
                        .setPlaceholder('Select an image')
                        .addOptions(
                            {
                                label: 'Top Left',
                                description: 'The top left image.',
                                value: 'topLeft',
                            },
                            {
                                label: 'Top Right',
                                description: 'The top right image.',
                                value: 'topRight',
                            },
                            {
                                label: 'Bottom Left',
                                description: 'The bottom left image.',
                                value: 'bottomLeft',
                            },
                            {
                                label: 'Bottom Right',
                                description: 'The bottom right image.',
                                value: 'bottomRight',
                            },
                        )
                ])
        ]
    }
}
