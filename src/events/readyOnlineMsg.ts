import { Bot } from '../bot'
import { BotEvent } from '../types'

const botEvent: BotEvent = {
    name: 'Online Status',
    event: 'ready',
    once: true,
    execute(bot: Bot) {
        bot.log.info('Discord connected')
    }
}

export default botEvent
