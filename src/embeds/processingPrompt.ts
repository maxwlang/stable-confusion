import { EmbedBuilder, codeBlock, ActionRowBuilder } from 'discord.js'
import { BotEmbed, QueueItem, QueueItemType } from '../types'

export default function(queueItem: QueueItem): BotEmbed {
    let embeds: EmbedBuilder[] = []
    let components: ActionRowBuilder<any>[] = []

    switch (queueItem.type) {
        case QueueItemType.Quick:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Processing Quick Imagine')
                    .setDescription('Your quick image is being generated based on the supplied prompt..')
                    .setThumbnail('https://i.gifer.com/2RNf.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: codeBlock(queueItem.prediction.prompt), inline: false},
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
        
        case QueueItemType.Regenerated:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Processing Regenerate')
                    .setDescription('Your images are being regenerated..')
                    .setThumbnail('https://i.gifer.com/2RNf.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: codeBlock(queueItem.prediction.prompt), inline: false},
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
        
        case QueueItemType.Variant:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Processing Variants')
                    .setDescription('Your image variants are being generated based on the below image..')
                    .setThumbnail('https://i.gifer.com/2RNf.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: codeBlock(queueItem.prediction.prompt), inline: false},
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
        
        case QueueItemType.Upscaled:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Processing Upscale')
                    .setDescription('The image below is being upscaled..')
                    .setThumbnail('https://i.gifer.com/2RNf.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: codeBlock(queueItem.prediction.prompt), inline: false},
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

        case QueueItemType.Default:
        default:
            embeds = [
                new EmbedBuilder()
                    .setColor('#030354')
                    .setTitle('Processing Prompt')
                    .setDescription('Your images are being generated..')
                    .setThumbnail('https://i.gifer.com/2RNf.gif')
                    .setTimestamp()
                    .addFields([
                        {name: 'Prompt', value: codeBlock(queueItem.prediction.prompt), inline: false},
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
  