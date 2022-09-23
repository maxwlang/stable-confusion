import { Interaction } from 'discord.js'
import { Bot } from '../bot'
import { BotEvent, QueueItem } from '../types'
import addedToQueue from '../embeds/addedToQueue'
import { v4 as uuidv4 } from 'uuid'
import addedToQueueNoWait from '../embeds/addedToQueueNoWait'
import { getImageAttachmentURL, getRandomInt, validateHeight, validateWidth } from '../utils'

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

        const queueItem: QueueItem = {
          discordCaller: interaction.user.id.toString(),
          seed: seed ?? getRandomInt(1, 99999999),
          uuid: uuidv4(),
          interaction,
          prediction: {
            prompt,
            width: 512,
            height: 512,
            initImage,
            mask,
            promptStrength: promptStrength ?? 0.8,
            numOutputs: 4,
            numInferenceSteps: numInferenceSteps ?? 50,
            guidanceScale: guidanceScale ?? 7.5
          }
        }

        // bot.log.debug(`QueueItem: ${JSON.stringify(queueItem)}`)
        bot.log.debug(`isProcessing: ${bot.stableDiffusion.isProcessing()} hasQueue: ${bot.hasQueue()} queueLength: ${bot.queue.length}`)

        if (bot.stableDiffusion.isProcessing() || bot.hasQueue()) {
          const queuePos = bot.addQueue(queueItem)

          await interaction.editReply({
            embeds: addedToQueue(queuePos, queueItem).embeds
          })
        } else {
          bot.addQueue(queueItem)

          await interaction.editReply({
            embeds: addedToQueueNoWait(queueItem).embeds
          })
        }
    }
}

export default botEvent