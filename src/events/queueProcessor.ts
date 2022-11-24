import { AttachmentBuilder } from 'discord.js'
import { isEmpty, isNil } from 'ramda'
import sharp from 'sharp'
import { Bot } from '../bot'
import imageResult from '../embeds/imageResult'
import processingPrompt from '../embeds/processingPrompt'
import { BotEvent, QueueItems } from '../types'

const botEvent: BotEvent = {
    name: 'Queue Processor',
    event: 'ready',
    once: true,
    execute(bot: Bot) {
        bot.log.debug('Processor init')
        setInterval(async () => await tick(bot), 300)
    }
}

let tickLock = false
async function tick(bot: Bot) {
    if (bot.stableDiffusion.isProcessing() || tickLock) return
    if (isNil(bot.queue) || isEmpty(bot.queue)) return
    tickLock = true
    bot.log.debug(`isProcessing ; queueLength: ${bot.queue.length - 1}`)
    const queueItem = bot.queue[0]

    try {
        const processingPromptEmbed = processingPrompt(queueItem)
        const message = await queueItem.discordInteraction.editReply({
            embeds: processingPromptEmbed.embeds
        })
        queueItem.discordMessageSnowflake = message.id

        const processResults = await bot.stableDiffusion.processRequest(queueItem)
        if (processResults === false) {
            const message = await queueItem.discordInteraction.editReply({
                content: 'Processing for this prompt has failed.',
                embeds: undefined
            })
            await message.suppressEmbeds()

            bot.log.debug('Processing failed')
            bot.removeQueuedQueueItem(queueItem.uuid)
            tickLock = false
            return
        }

        switch(queueItem.type) {
            case QueueItems.QueueItemTypes.Quick: {
                const imageResultEmbed = imageResult(queueItem)
                const data: string = processResults[0].split(',')[1]
                const buf = Buffer.from(data, 'base64')
                const file = new AttachmentBuilder(buf, {
                    name: `stable-confusion_${queueItem.uuid}.jpeg`
                })

                queueItem.imageData = [buf]
        
                await queueItem.discordInteraction.editReply({
                    embeds: imageResultEmbed.embeds,
                    components: imageResultEmbed.components,
                    files: [file]
                })
                break
            }

            case QueueItems.QueueItemTypes.Default:
            default: {
                const imageResultEmbed = imageResult(queueItem)
                const imageData: string[] = processResults.map(base64 => base64.split(',')[1])
                const imageBuffers = imageData.map(base64 => Buffer.from(base64, 'base64'))

                const collageImage = await sharp({
                    create: {
                    width: 1024,
                    height: 1024,
                    channels: 4,
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                    }
                })
                    .composite([
                        {
                            top: 0,
                            left: 0,
                            input: imageBuffers[0]
                        },
                        {
                            top: 0,
                            left: 512,
                            input: imageBuffers[1]
                        },
                        {
                            top: 512,
                            left: 0,
                            input: imageBuffers[2]
                        },
                        {
                            top: 512,
                            left: 512,
                            input: imageBuffers[3]
                        }
                    ])
                    .png()
                    .toBuffer()

                const file = new AttachmentBuilder(collageImage, {
                    name: `stable-confusion_${queueItem.uuid}_collage.png`
                })
        
                queueItem.imageData = imageBuffers
        
                await queueItem.discordInteraction.editReply({
                    embeds: imageResultEmbed.embeds,
                    components: imageResultEmbed.components,
                    files: [file]
                })
            }
        }
    
        bot.log.debug('Processing complete')
        bot.removeQueuedQueueItem(queueItem.uuid)
        tickLock = false
    // @ts-ignore no-implicit-any
    } catch(e: any) {
        bot.log.error(e.toString())
        bot.log.error(e.stack)
        tickLock = false
        await queueItem.discordInteraction.deleteReply().catch()
        await queueItem.discordInteraction.followUp('An error occured with your request.').catch()
    }
}

export default botEvent
