import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock } from 'discord.js'
import { BotEmbed, QueueItem } from '../types'

export default function(queueItem: QueueItem): BotEmbed {

    return {
        embeds: [
            new EmbedBuilder()
                .setColor('#6aaa64')
                .setTitle('Processing Complete')
                .setDescription('Result for parameters')
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
                .setImage(`attachment://stable-confusion_${queueItem.uuid}_collage.png`)
        ],
        components: [
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
}
