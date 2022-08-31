import { createLogger, format, transports } from 'winston'
import config from '../config/bot'

const {
    combine,
    colorize,
    printf,
    timestamp,
} = format

export default createLogger({
    level: config.logger.level ?? 'info',
    format: format.json(),
    transports: (() => {
        const transportStorage = []

        transportStorage.push(new transports.File({ filename: './data/logs.log' }))

        // Always log to console
        transportStorage.push(new transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'MM/DD/YYYY hh:mm:ss A' }),
                printf(({
                    timestamp,
                    level,
                    message,
                }) => `[${timestamp}][StableConfusion][${level}]: ${message}`),
            ),
        }))

        return transportStorage
    })(),
})
