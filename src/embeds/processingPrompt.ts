import { EmbedBuilder, codeBlock, ActionRowBuilder } from 'discord.js'
import { BotEmbed, QueueItems } from '../types'

export default function(queueItem: QueueItems.QueueItemInstances): BotEmbed {
    let embeds: EmbedBuilder[] = []
    let components: ActionRowBuilder<any>[] = []

    switch (queueItem.type) {
        case QueueItems.QueueItemTypes.Quick:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Processing Quick Imagine')
                    .setDescription('Your quick image is being generated based on the supplied prompt..')
                    .setThumbnail('https://i.gifer.com/2RNf.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: queueItem.prompt ? codeBlock(queueItem.prompt) : 'Not Supplied', inline: false},
                        {name: 'Prompt Strength', value: queueItem.promptStrength.toString(), inline: true},
                        {name: 'Steps', value: queueItem.numInferenceSteps.toString(), inline: true},
                        {name: 'Guidance Scale', value: queueItem.guidanceScale.toString(), inline: true},
                        {name: 'Has Mask', value: typeof queueItem.mask === 'undefined' ? 'No' : 'Yes', inline: true},
                        {name: 'Has Base Image', value: typeof queueItem.initImage === 'undefined' ? 'No' : 'Yes', inline: true},
                        {name: 'Seed', value: codeBlock(queueItem.seed.toString()), inline: false},
                        {name: 'Prompt ID', value: codeBlock(queueItem.uuid), inline: false}
                    ])
            ]
            break
        
        case QueueItems.QueueItemTypes.Regenerated:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Processing Regenerate')
                    .setDescription('Your images are being regenerated..')
                    .setThumbnail('https://i.gifer.com/2RNf.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: queueItem.prompt ? codeBlock(queueItem.prompt) : 'Not Supplied', inline: false},
                        {name: 'Prompt Strength', value: queueItem.promptStrength.toString(), inline: true},
                        {name: 'Steps', value: queueItem.numInferenceSteps.toString(), inline: true},
                        {name: 'Guidance Scale', value: queueItem.guidanceScale.toString(), inline: true},
                        {name: 'Has Mask', value: typeof queueItem.mask === 'undefined' ? 'No' : 'Yes', inline: true},
                        {name: 'Has Base Image', value: typeof queueItem.initImage === 'undefined' ? 'No' : 'Yes', inline: true},
                        {name: 'Seed', value: codeBlock(queueItem.seed.toString()), inline: false},
                        {name: 'Prompt ID', value: codeBlock(queueItem.uuid), inline: false}
                    ])
            ]
            break
        
        case QueueItems.QueueItemTypes.Variant:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Processing Variants')
                    .setDescription('Your image variants are being generated based on the below image..')
                    .setThumbnail('https://i.gifer.com/2RNf.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: queueItem.prompt ? codeBlock(queueItem.prompt) : 'Not Supplied', inline: false},
                        {name: 'Prompt Strength', value: queueItem.promptStrength.toString(), inline: true},
                        {name: 'Steps', value: queueItem.numInferenceSteps.toString(), inline: true},
                        {name: 'Guidance Scale', value: queueItem.guidanceScale.toString(), inline: true},
                        {name: 'Has Mask', value: typeof queueItem.mask === 'undefined' ? 'No' : 'Yes', inline: true},
                        {name: 'Has Base Image', value: typeof queueItem.initImage === 'undefined' ? 'No' : 'Yes', inline: true},
                        {name: 'Seed', value: codeBlock(queueItem.seed.toString()), inline: false},
                        {name: 'Prompt ID', value: codeBlock(queueItem.uuid), inline: false}
                    ])
            ]
            break
        
        case QueueItems.QueueItemTypes.Upscaled:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Processing Upscale')
                    .setDescription('The image below is being upscaled..')
                    .setThumbnail('https://i.gifer.com/2RNf.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: queueItem.prompt ? codeBlock(queueItem.prompt) : 'Not Supplied', inline: false},
                        {name: 'Prompt Strength', value: queueItem.promptStrength.toString(), inline: true},
                        {name: 'Steps', value: queueItem.numInferenceSteps.toString(), inline: true},
                        {name: 'Guidance Scale', value: queueItem.guidanceScale.toString(), inline: true},
                        {name: 'Has Mask', value: typeof queueItem.mask === 'undefined' ? 'No' : 'Yes', inline: true},
                        {name: 'Has Base Image', value: typeof queueItem.initImage === 'undefined' ? 'No' : 'Yes', inline: true},
                        {name: 'Seed', value: codeBlock(queueItem.seed.toString()), inline: false},
                        {name: 'Prompt ID', value: codeBlock(queueItem.uuid), inline: false}
                    ])
            ]
            break

        case QueueItems.QueueItemTypes.Default:
        default:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Processing Prompt')
                    .setDescription('Your images are being generated..')
                    .setThumbnail('https://i.gifer.com/2RNf.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: queueItem.prompt ? codeBlock(queueItem.prompt) : 'Not Supplied', inline: false},
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

    return {
        embeds,
        components
    }
}
  