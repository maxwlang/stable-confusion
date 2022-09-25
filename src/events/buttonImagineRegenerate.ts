import { Interaction } from 'discord.js'
import { isNil } from 'ramda'
import { Bot } from '../bot'
import { BotEvent, QueueItem, QueueItemType } from '../types'
import { getRandomInt } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import addedToQueue, { QueueType } from '../embeds/addedToQueue'

const botEvent: BotEvent = {
    name: 'Button Handler - Imagine Regenerate',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isButton()) return
        if (interaction.customId !== 'button-imagine-result-regenerate') return

        const referenceQueueItem = bot.findLatestQueueItemReferenceByMessageID(interaction.message.id)
        if (isNil(referenceQueueItem)) {
            await interaction.reply({
                ephemeral: true,
                content: 'There is no reference of this image generation. Most likely, this generation is too old to modify.'
            })

            return
        }
        
        const queueItem: QueueItem = {
            ...referenceQueueItem,
            type: QueueItemType.Regenerated,
            discordCaller: interaction.user.id.toString(),
            seed: getRandomInt(1, 99999999),
            uuid: uuidv4()
        }
        
        // Remove old attachment
        await interaction.message.removeAttachments()

        await interaction.reply({
            ephemeral: true,
            content: 'Your images are being regenerated. The original message will be updated once complete.'
        })

        if (bot.stableDiffusion.isProcessing() || bot.hasQueue()) {
            const queuePos = bot.addQueue(queueItem)

            await referenceQueueItem.interaction.editReply({
                embeds: addedToQueue(QueueType.Queued, queueItem, queuePos).embeds,
                components: []
            })
        } else {
            bot.addQueue(queueItem)

            await referenceQueueItem.interaction.editReply({
                embeds: addedToQueue(QueueType.Instant, queueItem).embeds,
                components: []
            })
        }
    }
}

export default botEvent
