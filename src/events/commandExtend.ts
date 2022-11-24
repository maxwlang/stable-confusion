import { Interaction } from 'discord.js'
import { Bot } from '../bot'
import { BotEvent, QueueItems } from '../types'
import { addedToInstantQueue, addedToQueue } from '../embeds/addedToQueue'
import { v4 as uuidv4 } from 'uuid'
import { getImageAttachmentURL, getRandomInt } from '../utils'

const botEvent: BotEvent = {
    name: 'Command Handler - Extend',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName !== 'extend') return

        await interaction.deferReply()

        const initImage = getImageAttachmentURL(interaction.options.getAttachment('image'))
        const mask = getImageAttachmentURL(interaction.options.getAttachment('mask'))
        const promptStrength = interaction.options.getNumber('pstrength')
        const numInferenceSteps = interaction.options.getInteger('numsteps')
        const guidanceScale = interaction.options.getNumber('guidancescale')
        const seed = interaction.options.getInteger('seed')

        const queueItem = new QueueItems.ExtendedQueueItem.ExtendedQueueItem({
          discordCallerSnowflake: interaction.user.id.toString(),
          discordInteraction: interaction,
          seed,
          prompt: undefined,
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