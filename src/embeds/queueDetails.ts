import { EmbedBuilder, codeBlock } from 'discord.js'
import { BotEmbed, QueueItem } from '../types'

export default function(queueItem: QueueItem): BotEmbed {
    return {
        embeds: [
            new EmbedBuilder()
                .setColor('#030354')
                .setTitle('Queued Prompt Details')
                .setThumbnail('https://i.imgur.com/wj1PRKP.png')
                .setTimestamp()
                .addFields([
                    {name: 'Prompt', value: queueItem.prediction.prompt ? codeBlock(queueItem.prediction.prompt) : 'Not Supplied', inline: false},
                    {name: 'Width', value: queueItem.prediction.width.toString(), inline: true},
                    {name: 'Height', value: queueItem.prediction.height.toString(), inline: true},
                    {name: 'Prompt Strength', value: queueItem.prediction.promptStrength.toString(), inline: true},
                    {name: 'Steps', value: queueItem.prediction.numInferenceSteps.toString(), inline: true},
                    {name: 'Guidance Scale', value: queueItem.prediction.guidanceScale.toString(), inline: true},
                    {name: 'Has Mask', value: typeof queueItem.prediction.mask === 'undefined' ? 'No' : 'Yes', inline: true},
                    {name: 'Has Base Image', value: typeof queueItem.prediction.initImage === 'undefined' ? 'No' : 'Yes', inline: true},
                    {name: 'Seed', value: codeBlock(queueItem.seed.toString()), inline: false},
                    {name: 'Prompt ID', value: codeBlock(queueItem.uuid), inline: false}
                ])
        ]
    }
}
