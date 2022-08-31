import { EmbedBuilder, codeBlock, ActionRowBuilder, userMention, ButtonBuilder, ButtonStyle } from 'discord.js'
import { BotEmbed, QueueItem } from '../types'

interface QueueShowArgs {
    queueItems: QueueItem[]
    positions: number[]
}

export default function(args: QueueShowArgs): BotEmbed {
    let fields = []

    for (const position of args.positions) {
        const queueItem = args.queueItems[position]
        if (typeof queueItem === 'undefined') break
        
        const queueField = [
            {name: position === 0 ? 'Next Up' : 'Queue Position', value: position === 0 ? 'This will be generated next' : `#${position}`, inline: false},
            {name: 'Prompt', value: codeBlock(queueItem.prediction.prompt), inline: true},
            {name: 'Owner', value: userMention(queueItem.discordCaller), inline: true},
            {name: 'Prompt ID', value: codeBlock(queueItem.uuid), inline: true},
        ]

        fields.push(...queueField)
    }

    return {
        embeds: [
            new EmbedBuilder()
                .setColor('#030354')
                .setTitle('Generation Queue')
                .setDescription(`The following prompts are awaiting generation.`)
                .setThumbnail('https://i.imgur.com/0XBCeyK.gif')
                .setTimestamp()
                .addFields(fields)
        ],
        components: [
            new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setCustomId('queue-show-prevPage')
                        .setLabel('Prev')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(args.positions[0] === 0),
                    new ButtonBuilder()
                        .setCustomId('queue-show-nextPage')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(args.positions[args.positions.length - 1] >= args.queueItems.length - 1)
                    ]
                )
        ]
    }
}

