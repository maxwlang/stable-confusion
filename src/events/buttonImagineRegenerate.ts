import { Interaction } from 'discord.js'
import { isNil } from 'ramda'
import { Bot } from '../bot'
import { BotEvent, QueueItems } from '../types'
import { addedToInstantQueue, addedToQueue } from '../embeds/addedToQueue'

const botEvent: BotEvent = {
    name: 'Button Handler - Imagine Regenerate',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isButton()) return
        if (interaction.customId !== 'button-imagine-result-regenerate') return

        const referenceQueueItem = bot.findLatestQueueItemReferenceByMessageSnowflake(interaction.message.id)
        if (isNil(referenceQueueItem)) {
            await interaction.reply({
                ephemeral: true,
                content: 'There is no reference of this image generation. Most likely, this generation is too old to modify.'
            })

            return
        }

        const queueItem = new QueueItems.RegeneratedQueueItem.RegeneratedQueueItem({
            discordCallerSnowflake: interaction.user.id.toString(),
            discordInteraction: interaction,
            discordMessageSnowflake: interaction.message.id,
            prompt: referenceQueueItem.prompt,
            height: referenceQueueItem.height,
            width: referenceQueueItem.width,
            initImage: referenceQueueItem.initImage,
            mask: referenceQueueItem.mask,
            promptStrength: referenceQueueItem.promptStrength,
            guidanceScale: referenceQueueItem.guidanceScale,
            numInferenceSteps: referenceQueueItem.numInferenceSteps
        })

        // Remove old attachment
        await interaction.message.removeAttachments()

        await interaction.reply({
            ephemeral: true,
            content: 'Your images are being regenerated. The original message will be updated once complete.'
        })

        if (bot.stableDiffusion.isProcessing() || bot.hasQueue()) {
            const queuePos = bot.addQueue(queueItem)

            await referenceQueueItem.discordInteraction.editReply({
                embeds: addedToQueue(queueItem, queuePos).embeds,
                components: []
            })
        } else {
            bot.addQueue(queueItem)

            await referenceQueueItem.discordInteraction.editReply({
                embeds: addedToInstantQueue(queueItem).embeds,
                components: []
            })
        }
    }
}

export default botEvent
