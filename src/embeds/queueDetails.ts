import { EmbedBuilder, codeBlock } from 'discord.js'
import { BotEmbed, QueueItems } from '../types'

export default function(queueItem: QueueItems.QueueItemInstances): BotEmbed {
    return {
        embeds: [
            new EmbedBuilder()
                .setColor('#030354')
                .setTitle('Queued Prompt Details')
                .setThumbnail('https://i.imgur.com/wj1PRKP.png')
                .setTimestamp()
                .addFields([
                    {name: 'Prompt', value: queueItem.prompt ? codeBlock(queueItem.prompt) : 'Not Supplied', inline: false},
                    {name: 'Width', value: queueItem.width.toString(), inline: true},
                    {name: 'Height', value: queueItem.height.toString(), inline: true},
                    {name: 'Prompt Strength', value: queueItem.promptStrength.toString(), inline: true},
                    {name: 'Steps', value: queueItem.numInferenceSteps.toString(), inline: true},
                    {name: 'Guidance Scale', value: queueItem.guidanceScale.toString(), inline: true},
                    {name: 'Has Mask', value: typeof queueItem.mask === 'undefined' ? 'No' : 'Yes', inline: true},
                    {name: 'Has Base Image', value: typeof queueItem.initImage === 'undefined' ? 'No' : 'Yes', inline: true},
                    {name: 'Seed', value: codeBlock(queueItem.seed.toString()), inline: false},
                    {name: 'Prompt ID', value: codeBlock(queueItem.uuid), inline: false}
                ])
        ]
    }
}
