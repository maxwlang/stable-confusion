import { EmbedBuilder, codeBlock, ActionRowBuilder } from 'discord.js'
import { BotEmbed, QueueItem } from '../types'

export enum QueueType {
    Instant,
    Queued
}

export default function(queueType: QueueType, queueItem: QueueItem, queuePosition?: number): BotEmbed {
    let embeds: EmbedBuilder[] = []
    let components: ActionRowBuilder<any>[] = []

    switch (queueType) {
        case QueueType.Queued:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Prompt added to queue')
                    .setDescription(`Your prompt has been added to the image generation queue and is currently in position number ${queuePosition}.`)
                    .setThumbnail('https://i.imgur.com/pXmPAAG.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: codeBlock(queueItem.prediction.prompt), inline: false},
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
            break

        case QueueType.Instant:
        default:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Prompt will generate shortly')
                    .setDescription(`Your prompt is currently first in the queue and will begin generating shortly.`)
                    .setThumbnail('https://i.imgur.com/pXmPAAG.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: codeBlock(queueItem.prediction.prompt), inline: false},
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

    
    return {
        embeds,
        components
    }
}
