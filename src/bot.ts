import bPromise from 'bluebird'
import { Client, GatewayIntentBits, Partials, REST, Routes } from 'discord.js'
import fs from 'fs'
import { isEmpty, isNil } from 'ramda'
import { Logger } from 'winston'
import Config from './config/bot'
import { BotCommand, BotEvent, QueueItem } from './types'

export class Bot extends Client {
    constructor(config: typeof Config, logger: Logger, options: {[k: string]: string}) {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction],
            ...options,
        })
        this.queue = []
        this.processing = null
        this.config = config
        this.log = logger
        this.rest = new REST({ version: '10' }).setToken(config.bot.token)
    }

    /**
     * Array of QueueItems awaiting processing.
     */
    public queue: QueueItem[]

    /**
     * Current QueueItem processing.
     */
    public processing: QueueItem | null

    /**
     * The bot's running config
     */
    public config: typeof Config

    /**
     * Winston logger instance
     */
    public log: Logger

    /**
     * Rest request endpoint
     */
    public rest: REST

    /**
     * @returns Returns boolean value if item is in processing state.
     */
    public isProcessing = () => this.processing !== null

    /**
     * @returns Returns boolean value if items exist in queue.
     */
    public hasQueue = () => this.queue.length > 0

    /**
     * Adds a QueueItem to queue.
     * @param queueItem QueueItem to add to queue.
     * @returns Number of items in queue.
     */
    public addQueue = (queueItem: QueueItem): number => this.queue.push(queueItem)

    /**
     * Deletes a QueueItem from queue. Throws if it can't find a QueueItem for uuid.
     * @param uuid UUID of QueueItem.
     * @returns Array of deleted QueueItems.
     */
    public removeQueue = (uuid: string): QueueItem[] => {
        const queueIndex = this.queue.findIndex(queueItem => queueItem.uuid === uuid)

        if (queueIndex === -1) throw new Error(`No QueueItem for uuid"${uuid}".`)
        return this.queue.splice(queueIndex, 1)
    }
}

module.exports = async (config: typeof Config, logger: Logger, options: {[k: string]: string}) => {
    const bot = new Bot(config, logger, options)
    bot.login(config.bot.token)

    // Register event handlers
    const eventFiles = fs.readdirSync('./dist/events').filter((file) => file.endsWith('.js'))
    await bPromise.each(eventFiles, file => {
        // eslint-disable-next-line import/no-dynamic-require
        bot.log.debug(`Loading event file "${file}"`)
        const event: BotEvent = require(`./events/${file}`).default
        bot.log.info(`Loaded "${event.name}" eventhandler`)

        if (event.once) return bot.once(event.name, async (...args) => runEvent(bot, file, event, args))
        bot.on(event.name, async (...args) => runEvent(bot, file, event, args))
    })

    // Register commands
    const commandFiles = fs.readdirSync('./dist/commands').filter((file) => file.endsWith('.js'))
    // eslint-disable-next-line import/no-dynamic-require
    const commands: BotCommand[] = commandFiles.map(commandFile => require(`./commands/${commandFile}`).default(bot))
    // const guildCommands = commands.filter(command => !isNil(command.guilds) && !isEmpty(command.guilds))
    const globalCommands = commands.filter(command => isNil(command.guilds) || isEmpty(command.guilds))

    // if (!isNil(guildCommands) && !isEmpty(guildCommands)) {
    //     bot.log.info(`Loading ${guildCommands.length} guild commands`)
    //     const commandsArray = guildCommands.map(command => command.commandJson)
    //     await bPromise.each(guildCommands, async guildCommand =>
    //         await bot.rest.put(Routes.applicationGuildCommands(bot.user?.id ?? config.bot.userid, guildCommand.))
    //     )
    // }

    if (!isNil(globalCommands) && !isEmpty(globalCommands)) {
        bot.log.info(`Loading ${globalCommands.length} global commands`)
        const commandsArray = globalCommands.map(command => command.commandJson)
        await bot.rest.put(Routes.applicationCommands(bot.user?.id ?? config.bot.userid), {
            body: commandsArray
        })
    }
}

// @ts-ignore no-implicit-any
async function runEvent(bot: Bot, name: string, event: BotEvent, args: any) {
    try {
        await event.execute(bot, ...args)
        // @ts-ignore no-implicit-any
    } catch (e: any) {
        bot.log.error(`Event "${name}" (Trigger: "${event.name}") failed with error: ${e.message}\n${e.stack}`)
    }
}
