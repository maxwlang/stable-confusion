import { Interaction } from 'discord.js'
import { Bot } from '../bot'
import { BotEvent, QueueItems } from '../types'
import { addedToInstantQueue, addedToQueue } from '../embeds/addedToQueue'
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
        const numOutputs = interaction.options.getInteger('numout')
        const numInferenceSteps = interaction.options.getInteger('numsteps')
        const guidanceScale = interaction.options.getNumber('guidancescale')
        const seed = interaction.options.getInteger('seed')

        // const queueItem: QueueItem = {
        //   discordCaller: interaction.user.id.toString(),
        //   seed: seed ?? getRandomInt(1, 99999999),
        //   uuid: uuidv4(),
        //   interaction,
        //   type: QueueItemType.Quick,
        //   prediction: {
        //     prompt,
        //     width,
        //     height,
        //     initImage,
        //     mask,
        //     promptStrength: promptStrength ?? 0.8,
        //     numOutputs: numOutputs ?? 1,
        //     numInferenceSteps: numInferenceSteps ?? 50,
        //     guidanceScale: guidanceScale ?? 7.5
        //   }
        // }

        const queueItem = new QueueItems.QuickQueueItem.QuickQueueItem({
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
        }, {
          test: true
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