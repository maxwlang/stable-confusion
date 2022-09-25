import { AttachmentBuilder, Interaction } from "discord.js"
import { isEmpty, isNil } from "ramda"
import { Bot } from '../bot'
import { BotEvent, QueueItemType } from '../types'

import imageResult from "../embeds/imageResult"
import imageSelectPrompt from "../embeds/imageSelectPrompt"

const botEvent: BotEvent = {
    name: 'Button Handler - Imagine Upscale',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isButton() && !interaction.isSelectMenu()) return
        if (interaction.customId === 'image-select-prompt-upscaled' && interaction.isSelectMenu()) {
            // TODO: Lock this action to user who triggered prompt?

            const referenceQueueItem = bot.findLatestQueueItemReferenceByMessageID(interaction.message.id)
            if (isNil(referenceQueueItem) || isNil(referenceQueueItem.imageData) || isEmpty(referenceQueueItem.imageData)) {
                await interaction.reply({
                    ephemeral: true,
                    content: 'There is no reference of this image generation. Most likely, this generation is too old to modify.'
                })
                return
            }
            
            // We can cheat here, we don't really need to generate anything. We just take the image out of the collage.
            // Maybe we add ai upscaling here in the future?
            const [selectedImage] = interaction.values
            const imageResultEmbed = imageResult({...referenceQueueItem, type: QueueItemType.Upscaled})

            const file = new AttachmentBuilder(referenceQueueItem.imageData[+selectedImage], {
                name: `stable-confusion_${referenceQueueItem.uuid}_upscaled.jpeg`,
                description: referenceQueueItem.prediction.prompt
            })

            await referenceQueueItem.interaction.editReply({
                embeds: imageResultEmbed.embeds,
                components: imageResultEmbed.components,
                files: [file]
            })
        } else if (interaction.customId === 'button-imagine-result-upscale' && interaction.isButton()) {
            const referenceQueueItem = bot.findLatestQueueItemReferenceByMessageID(interaction.message.id)
            if (isNil(referenceQueueItem)) {
                await interaction.reply({
                    ephemeral: true,
                    content: 'There is no reference of this image generation. Most likely, this generation is too old to modify.'
                })
                return
            }

            const imageSelectPromptEmbed = imageSelectPrompt({...referenceQueueItem, type: QueueItemType.Upscaled})

            await referenceQueueItem.interaction.editReply({
                embeds: imageSelectPromptEmbed.embeds,
                components: imageSelectPromptEmbed.components
            })
        }
        return
    }
}

export default botEvent
