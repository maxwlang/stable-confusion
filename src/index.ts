import config from './config/bot'
import logger from './modules/logger'

(async () => {
    try {
        logger.info('Loading bot')
        await require('./bot')(config, logger)
    // @ts-ignore no-implicit-any
    } catch (e: any) {
        logger.error(e.toString())
    }
})()
