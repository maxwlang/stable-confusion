import { Bot } from '../bot'
import { BotEvent } from '../types'

const botEvent: BotEvent = {
    name: 'ready',
    once: true,
    execute(bot: Bot) {
        bot.log.info('Discord connected')
    }
}

export default botEvent
