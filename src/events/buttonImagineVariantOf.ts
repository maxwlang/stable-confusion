import { Interaction } from "discord.js"
import { isEmpty, isNil } from "ramda"
import { Bot } from '../bot'
import { BotEvent, QueueItem, QueueItemType } from '../types'
import imageSelectPrompt from '../embeds/imageSelectPrompt'
import { v4 as uuidv4 } from 'uuid'
import addedToQueue, { QueueType } from "../embeds/addedToQueue"

const botEvent: BotEvent = {
    name: 'Button Handler - Imagine Variant Of',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isButton() && !interaction.isSelectMenu()) return
        if (interaction.customId === 'image-select-prompt-variant' && interaction.isSelectMenu()) {
            // TODO: Lock this action to user who triggered prompt?

            const referenceQueueItem = bot.findLatestQueueItemReferenceByMessageID(interaction.message.id)
            if (isNil(referenceQueueItem) || isNil(referenceQueueItem.imageData) || isEmpty(referenceQueueItem.imageData)) {
                await interaction.reply({
                    ephemeral: true,
                    content: 'There is no reference of this image generation. Most likely, this generation is too old to modify.'
                })
                return
            }
            
            const [selectedImage] = interaction.values

            // Ensure PNG
            const selectedImageB64 = `data:image/png;base64,${referenceQueueItem.imageData[+selectedImage].toString('base64')}`
            const queueItem: QueueItem = {
                ...referenceQueueItem,
                type: QueueItemType.Variant,
                prediction: {
                    prompt: referenceQueueItem.prediction.prompt,
                    promptStrength: 0.8,
                    initImage: selectedImageB64,
                    numOutputs: 4,
                    height: referenceQueueItem.prediction.height,
                    width: referenceQueueItem.prediction.width,
                    guidanceScale: referenceQueueItem.prediction.guidanceScale,
                    mask: referenceQueueItem.prediction.mask,
                    numInferenceSteps: referenceQueueItem.prediction.numInferenceSteps
                },
                discordCaller: interaction.user.id.toString(),
                uuid: uuidv4()
            }
            
            // Remove old attachment
            await interaction.message.removeAttachments()

            await interaction.reply({
                ephemeral: true,
                content: 'Your image variants are being generated. The original message will be updated once complete.'
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
        } else if (interaction.customId === 'button-imagine-result-variant-of' && interaction.isButton()) {
            const referenceQueueItem = bot.findLatestQueueItemReferenceByMessageID(interaction.message.id)
            if (isNil(referenceQueueItem)) {
                await interaction.reply({
                    ephemeral: true,
                    content: 'There is no reference of this image generation. Most likely, this generation is too old to modify.'
                })
                return
            }

            await interaction.deferUpdate() // We defer the update here because we'll update the queueItem interaction instead.

            const imageSelectPromptEmbed = imageSelectPrompt({...referenceQueueItem, type: QueueItemType.Variant})

            await referenceQueueItem.interaction.editReply({
                embeds: imageSelectPromptEmbed.embeds,
                components: imageSelectPromptEmbed.components
            })
        }
        return
    }
}

export default botEvent
