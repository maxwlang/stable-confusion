import { EmbedBuilder, codeBlock, ActionRowBuilder } from 'discord.js'
import { BotEmbed, QueueItems } from '../types'

export enum QueueType {
    Instant,
    Queued
}

export function addedToInstantQueue(queueItem: QueueItems.QueueItemInstances): BotEmbed {
    let embeds: EmbedBuilder[] = []
    let components: ActionRowBuilder<any>[] = []

    embeds = [
        new EmbedBuilder()
            .setColor('#030354')
            .setTitle('Prompt will generate shortly')
            .setDescription(`Your prompt is currently first in the queue and will begin generating shortly.`)
            .setThumbnail('https://i.imgur.com/pXmPAAG.gif')
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

    return {
        embeds,
        components
    }
}

export function addedToQueue(queueItem: QueueItems.QueueItemInstances, queuePosition: number): BotEmbed {
    let embeds: EmbedBuilder[] = []
    let components: ActionRowBuilder<any>[] = []

    embeds = [
        new EmbedBuilder()
            .setColor('#030354')
            .setTitle('Prompt added to queue')
            .setDescription(`Your prompt has been added to the image generation queue and is currently in position number ${queuePosition}.`)
            .setThumbnail('https://i.imgur.com/pXmPAAG.gif')
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

    return {
        embeds,
        components
    }
}
