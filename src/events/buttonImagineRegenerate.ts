import { Interaction } from 'discord.js'
import { isNil } from 'ramda'
import { Bot } from '../bot'
import { BotEvent, QueueItem } from '../types'
import { getRandomInt } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import addedToQueue from '../embeds/addedToQueue'
import addedToQueueNoWait from '../embeds/addedToQueueNoWait'

const botEvent: BotEvent = {
    name: 'Command Handler - Ping',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isButton()) return
        if (interaction.customId !== 'button-imagine-result-regenerate') return

        const referenceQueueItem = bot.findQueueItemReferenceByMessageID(interaction.message.id)
        if (isNil(referenceQueueItem)) {
            await interaction.reply({
                ephemeral: true,
                content: 'There is no reference of this image generation. Most likely, this generation is too old to modify.'
            }).then(message => {
                // TODO: Remove message after 5 seconds
                // setTimeout(async () => {
                //     if (!message.interaction.isRepliable) return
                //     const msg = await message.awaitMessageComponent()
                //     await msg.deleteReply()
                // }, 5000)
            })
            return
        }
        
        const queueItem: QueueItem = {
            ...referenceQueueItem,
            discordCaller: interaction.user.id.toString(),
            seed: getRandomInt(1, 99999999),
            uuid: uuidv4()
        }
        
        bot.log.debug(`isProcessing: ${bot.stableDiffusion.isProcessing()} hasQueue: ${bot.hasQueue()} queueLength: ${bot.queue.length}`)
        
        // Remove old attachment
        await interaction.message.removeAttachments()

        await interaction.reply({
            ephemeral: true,
            content: 'Your images are being regenerated. The original message will be updated once complete.'
        }).then(message => {
            // TODO: Remove message after 5 seconds
            // setTimeout(async () => {
            //     if (!message.interaction.isRepliable) return
            //     const msg = await message.awaitMessageComponent()
            //     await msg.deleteReply()
            // }, 5000)
        })


        if (bot.stableDiffusion.isProcessing() || bot.hasQueue()) {
            const queuePos = bot.addQueue(queueItem)

            await referenceQueueItem.interaction.editReply({
                embeds: addedToQueue(queuePos, queueItem).embeds
            })
        } else {
            bot.addQueue(queueItem)

            await referenceQueueItem.interaction.editReply({
                embeds: addedToQueueNoWait(queueItem).embeds
            })
        }
    }
}

export default botEvent
