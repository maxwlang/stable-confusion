import { Attachment, Interaction } from 'discord.js'
import { Bot } from '../bot'
import { BotEvent, QueueItem } from '../types'
import addedToQueue from '../embeds/addedToQueue'
import { isNil } from 'ramda'
import { v4 as uuidv4 } from 'uuid'
import addedToQueueNoWait from '../embeds/addedToQueueNoWait'

const botEvent: BotEvent = {
    name: 'Command Handler - Imagine',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName !== 'imagine') return

        await interaction.deferReply()

        const prompt = interaction.options.getString('prompt', true)
        const width = validateWidth(interaction.options.getInteger('width'))
        const height = validateHeight(interaction.options.getInteger('height'))
        const initImage = getImageAttachmentURL(interaction.options.getAttachment('image'))
        const mask = getImageAttachmentURL(interaction.options.getAttachment('mask'))
        const promptStrength = interaction.options.getNumber('pstrength')
        const numOutputs = interaction.options.getInteger('numout')
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
            width,
            height,
            initImage,
            mask,
            promptStrength: promptStrength ?? 0.8,
            numOutputs: numOutputs ?? 1,
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

const validateWidth = (width: number | null): number => {
  if (isNil(width) || typeof width !== 'number' || width < 128 || width > 1024) return 512
  return width
}

const validateHeight = (height: number | null): number => {
  if (isNil(height) || typeof height !== 'number' || height < 128 || height > 1024) return 512
  return height
}

const getImageAttachmentURL = (attachment: Attachment | null): string | undefined => {
  const imageMimes = ['image/jpeg', 'image/jpg', 'image/png']
  if (isNil(attachment) || isNil(attachment.contentType)) return
  if (!imageMimes.includes(attachment.contentType)) return
  return attachment.url
}

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export default botEvent