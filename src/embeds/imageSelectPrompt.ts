import { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } from 'discord.js'
import { BotEmbed, QueueItems } from '../types'

export default function(queueItem: QueueItems.QueueItemInstances): BotEmbed {
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
                                label: '↖️ Top Left',
                                description: 'The top left image.',
                                value: '0',
                            },
                            {
                                label: '↗️ Top Right',
                                description: 'The top right image.',
                                value: '1',
                            },
                            {
                                label: '↙️ Bottom Left',
                                description: 'The bottom left image.',
                                value: '2',
                            },
                            {
                                label: '↘️ Bottom Right',
                                description: 'The bottom right image.',
                                value: '3',
                            },
                        )
                ])
        ]
    }
}
