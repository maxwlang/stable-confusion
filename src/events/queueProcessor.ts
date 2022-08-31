import { isEmpty, isNil } from 'ramda'
import { Bot } from '../bot'
import imageResult from '../embeds/imageResult'
import processingPrompt from '../embeds/processingPrompt'
import { BotEvent } from '../types'
import { Attachment, AttachmentBuilder } from 'discord.js'

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
    bot.log.debug('Processing..')
    const queueItem = bot.queue[0]
    bot.log.debug(JSON.stringify(queueItem))

    try {
        const processingPromptEmbed = processingPrompt(queueItem)
        await queueItem.interaction.editReply({
            embeds: processingPromptEmbed.embeds
        })

        const processResults = await bot.stableDiffusion.processRequest(queueItem)
        if (processResults === false) {
            const message = await queueItem.interaction.editReply({
                content: 'Processing for this prompt has failed. Most likely, the bot thinks it is NSFW.',
                embeds: undefined
            })
            await message.suppressEmbeds()

            bot.log.debug('Processing failed')
            bot.removeQueue(queueItem.uuid)
            tickLock = false
            return
        }

        // await queueItem.interaction.deleteReply()
    
        for (const processResult of processResults) {
            const imageResultEmbed = imageResult()
            const data: string = processResult.split(',')[1]
            const buf = Buffer.from(data, 'base64')
            const file = new AttachmentBuilder(buf, {
                name: 'stable-confusion.jpeg'
            })
        

            await queueItem.interaction.followUp({
                embeds: imageResultEmbed.embeds,
                files: [file]
            })

        }
    
        bot.log.debug('Processing complete')
        bot.removeQueue(queueItem.uuid)
        tickLock = false
    // @ts-ignore no-implicit-any
    } catch(e: any) {
        bot.log.error(e.toString())
        bot.log.error(e.stack)
        tickLock = false
        await queueItem.interaction.deleteReply().catch()
        await queueItem.interaction.followUp('An error occured with your request.').catch()
    }
}

export default botEvent
