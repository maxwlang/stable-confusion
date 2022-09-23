import { isEmpty, isNil } from 'ramda'
import { Bot } from '../bot'
import { BotEvent } from '../types'

const botEvent: BotEvent = {
    name: 'Queue Reference Upkeep',
    event: 'ready',
    once: true,
    execute(bot: Bot) {
        bot.log.debug('Queue Reference Upkeep init')
        setInterval(async () => await tick(bot), 1000)
    }
}

let tickLock = false
async function tick(bot: Bot) {
    if (isNil(bot.queueItemReferences) || isEmpty(bot.queueItemReferences)) return
    if (bot.queueItemReferences.length <= 20) return
    tickLock = true
    bot.log.debug('Removing oldest entry from queue references..')
    
    try {
        const oldestQueueItem = bot.queueItemReferences[0]
        bot.removeQueueItemReference(oldestQueueItem.uuid)
        tickLock = false
    // @ts-ignore no-implicit-any
    } catch(e: any) {
        bot.log.error(e.toString())
        bot.log.error(e.stack)
        tickLock = false
    }
}

export default botEvent
