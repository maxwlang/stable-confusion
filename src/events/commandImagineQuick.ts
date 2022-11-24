import { Interaction } from 'discord.js'
import { Bot } from '../bot'
import { addedToInstantQueue, addedToQueue } from '../embeds/addedToQueue'
import { BotEvent, QueueItems } from '../types'
import { getImageAttachmentURL, validateHeight, validateWidth } from '../utils'

const botEvent: BotEvent = {
    name: 'Command Handler - Quick Imagine',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName !== 'imagine-quick') return

        await interaction.deferReply()

        const prompt = interaction.options.getString('prompt', true)
        const width = validateWidth(interaction.options.getInteger('width'))
        const height = validateHeight(interaction.options.getInteger('height'))
        const initImage = getImageAttachmentURL(interaction.options.getAttachment('image'))
        const mask = getImageAttachmentURL(interaction.options.getAttachment('mask'))
        const promptStrength = interaction.options.getNumber('pstrength')
        const numInferenceSteps = interaction.options.getInteger('numsteps')
        const guidanceScale = interaction.options.getNumber('guidancescale')
        const seed = interaction.options.getInteger('seed')

        const queueItem = new QueueItems.QuickQueueItem.QuickQueueItem({
            discordCallerSnowflake: interaction.user.id.toString(),
            discordInteraction: interaction,
            seed,
            prompt,
            width,
            height,
            initImage,
            mask,
            promptStrength,
            guidanceScale,
            numInferenceSteps
        })

        if (bot.stableDiffusion.isProcessing() || bot.hasQueue()) {
          const queuePos = bot.addQueuedQueueItem(queueItem)

          await interaction.editReply({
            embeds: addedToQueue(queueItem, queuePos).embeds
          })
        } else {
          bot.addQueuedQueueItem(queueItem)

          await interaction.editReply({
            embeds: addedToInstantQueue(queueItem).embeds
          })
        }
    }
}

export default botEvent