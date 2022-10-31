import { Interaction } from 'discord.js'
import { Bot } from '../bot'
import { BotEvent, QueueItems } from '../types'
import { addedToInstantQueue, addedToQueue } from '../embeds/addedToQueue'
import { getImageAttachmentURL } from '../utils'

const botEvent: BotEvent = {
    name: 'Command Handler - Imagine',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName !== 'imagine') return

        await interaction.deferReply()

        const prompt = interaction.options.getString('prompt', true)
        const initImage = getImageAttachmentURL(interaction.options.getAttachment('image'))
        const mask = getImageAttachmentURL(interaction.options.getAttachment('mask'))
        const promptStrength = interaction.options.getNumber('pstrength')
        const numInferenceSteps = interaction.options.getInteger('numsteps')
        const guidanceScale = interaction.options.getNumber('guidancescale')
        const seed = interaction.options.getInteger('seed')

        const queueItem = new QueueItems.QueueItem.QueueItem({
            discordCallerSnowflake: interaction.user.id.toString(),
            discordInteraction: interaction,
            seed,
            prompt,
            width: 512,
            height: 512,
            initImage,
            mask,
            promptStrength,
            guidanceScale,
            numInferenceSteps
        })

        if (bot.stableDiffusion.isProcessing() || bot.hasQueue()) {
          const queuePos = bot.addQueue(queueItem)

          await interaction.editReply({
            embeds: addedToQueue(queueItem, queuePos).embeds
          })
        } else {
          bot.addQueue(queueItem)

          await interaction.editReply({
            embeds: addedToInstantQueue(queueItem).embeds
          })
        }
    }
}

export default botEvent