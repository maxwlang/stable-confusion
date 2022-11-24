import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock } from 'discord.js'
import { BotEmbed, QueueItems } from '../types'

export default function(queueItem: QueueItems.QueueItemInstances): BotEmbed {
    let embeds: EmbedBuilder[] = []
    let components: ActionRowBuilder<any>[] = []

    switch (queueItem.type) {
        case QueueItems.QueueItemTypes.Quick:
            embeds = [
                new EmbedBuilder()
                    .setColor('#6aaa64')
                    .setTitle('Processing Complete')
                    .setDescription('Result for parameters\n\nGenerated using the quick imagine command. Check out `/imagine` for new features!')
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
                    .setImage(`attachment://stable-confusion_${queueItem.uuid}.jpeg`)
            ]
            break

        case QueueItems.QueueItemTypes.Upscaled:
            embeds = [
                new EmbedBuilder()
                    .setColor('#6aaa64')
                    .setTitle('Upscaling Complete')
                    .setDescription('Result for upscale')
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
                    .setImage(`attachment://stable-confusion_${queueItem.uuid}_upscaled.jpeg`)
            ]
            break

        case QueueItems.QueueItemTypes.Variant: 
            embeds = [
                new EmbedBuilder()
                    .setColor('#6aaa64')
                    .setTitle('Processing Complete')
                    .setDescription('Variant results are displayed below')
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
                    .setImage(`attachment://stable-confusion_${queueItem.uuid}_collage.png`)
            ]
            components = [
                new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder()
                            .setCustomId('button-imagine-result-regenerate')
                            .setLabel('🔁 Regenerate All')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('button-imagine-result-upscale')
                            .setLabel('⬆️ Upscale..')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('button-imagine-result-variant-of')
                            .setLabel('🆎 Variant of..')
                            .setStyle(ButtonStyle.Primary),
                    ])
            ]
            break

        case QueueItems.QueueItemTypes.Regenerated:
        case QueueItems.QueueItemTypes.Default:
        default:
            embeds = [
                new EmbedBuilder()
                    .setColor('#6aaa64')
                    .setTitle('Processing Complete')
                    .setDescription('Result for parameters')
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
                    .setImage(`attachment://stable-confusion_${queueItem.uuid}_collage.png`)
            ]
            components = [
                new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder()
                            .setCustomId('button-imagine-result-regenerate')
                            .setLabel('🔁 Regenerate All')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('button-imagine-result-upscale')
                            .setLabel('⬆️ Upscale..')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('button-imagine-result-variant-of')
                            .setLabel('🆎 Variant of..')
                            .setStyle(ButtonStyle.Primary),
                    ])
            ]
    }

    return {
        embeds,
        components
    }
}
