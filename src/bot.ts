import { BotCommand, BotEvent, QueueItem } from './types'
import { Client, GatewayIntentBits, Partials, REST, Routes } from 'discord.js'
import { isEmpty, isNil } from 'ramda'

import Config from './config/bot'
import { Logger } from 'winston'
import StableDiffusion from './modules/stableDiffusion'
import bPromise from 'bluebird'
import fs from 'fs'
// @ts-ignore Ignore sequelize implicit any
import db from './sequelize/models'

export class Bot extends Client {
    constructor(config: typeof Config, logger: Logger, options: {[k: string]: string}) {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction],
            ...options,
        })

        this.db = db
        this.queue = []
        this.queueItemReferences = [] // TODO: Can we store this elsewhere and keep non-json references? Redis?
        this.processing = null
        this.config = config
        this.log = logger
        this.rest = new REST({ version: '10' }).setToken(config.bot.token)
        this.stableDiffusion = new StableDiffusion(config.server.host, config.server.port)
    }

    /**
     * Sequelize
     */
    public db: any

    /**
     * Array of QueueItems awaiting processing.
     */
    public queue: QueueItem[]

    /**
     * Array of previously used QueueItems.
     */
    public queueItemReferences: QueueItem[]

    /**
     * Current QueueItem processing.
     * TODO: Support multi-processing
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
     * Stable Diffusion interface
     */
    public stableDiffusion: StableDiffusion

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
     * Deletes a QueueItem from queue, adds it to queueItemReferences. Throws if it can't find a QueueItem for uuid.
     * @param uuid UUID of QueueItem.
     * @returns Array of deleted QueueItems.
     */
    public removeQueue = (uuid: string): QueueItem[] => {
        const queueIndex = this.queue.findIndex(queueItem => queueItem.uuid === uuid)

        if (queueIndex === -1) return []
        const queueItem = this.queue.splice(queueIndex, 1)
        this.queueItemReferences.push(queueItem[0])
        return queueItem
    }

    /**
     * Deletes a QueueItem from QueueItem reference storage. Throws if it can't find a QueueItem for uuid.
     * @param uuid UUID of QueueItem.
     * @returns Array of deleted QueueItems.
     */
    public removeQueueItemReference = (uuid: string): QueueItem[] => {
        const queueIndex = this.queueItemReferences.findIndex(queueItem => queueItem.uuid === uuid)

        if (queueIndex === -1) return []
        return this.queueItemReferences.splice(queueIndex, 1)
    }
    
    /**
     * Finds a QueueItem in queue storage by uuid.
     * @param uuid UUID of QueueItem.
     * @returns Array of found QueueItems.
     */
    public findQueue = (uuid: string): QueueItem | undefined => {
        return this.queue.find(queueItem => queueItem.uuid === uuid)
    }

    /**
     * Finds a QueueItem in reference storage by uuid.
     * @param uuid UUID of QueueItem.
     * @returns Array of found QueueItems.
     */
    public findQueueItemReference = (uuid: string): QueueItem | undefined => {
        return this.queueItemReferences.find(queueItem => queueItem.uuid === uuid)
    }

    /**
     * Finds the latest QueueItem in reference storage by message ID.
     * @param uuid UUID of QueueItem.
     * @returns Array of found QueueItems.
     */
     public findLatestQueueItemReferenceByMessageID = (messageId: string): QueueItem | undefined => {
        const queueItems = this.queueItemReferences.filter(queueItem => queueItem.messageId === messageId)
        return queueItems[queueItems.length - 1]
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

        if (event.once) return bot.once(event.event, async (...args) => runEvent(bot, event, args))
        bot.on(event.event, async (...args) => runEvent(bot, event, args))
    })

    // Register commands
    const commandFiles = fs.readdirSync('./dist/commands').filter((file) => file.endsWith('.js'))
    // eslint-disable-next-line import/no-dynamic-require
    const commands: BotCommand[] = commandFiles.map(commandFile => require(`./commands/${commandFile}`).default(bot))
    const guildCommands = commands.filter(command => !isNil(command.guilds) && !isEmpty(command.guilds))
    const commandGuilds: string[] = flatten(guildCommands.map(command => command.guilds).filter(guild => typeof guild !== undefined))
    const globalCommands = commands.filter(command => isNil(command.guilds) || isEmpty(command.guilds))

    if (!isNil(guildCommands) && !isEmpty(guildCommands) && !isNil(commandGuilds) && !isEmpty(commandGuilds)) {
        bot.log.info(`Loading ${guildCommands.length} guild commands for ${commandGuilds.length} guilds`)
        const commandsArray = guildCommands.map(command => command.commandJson)
        await bPromise.each(commandGuilds, async guild =>
            await bot.rest.put(Routes.applicationGuildCommands(bot.user?.id ?? config.bot.userid, guild),{
                body: commandsArray
            })
        )
    }

    if (!isNil(globalCommands) && !isEmpty(globalCommands)) {
        bot.log.info(`Loading ${globalCommands.length} global commands`)
        const commandsArray = globalCommands.map(command => command.commandJson)
        await bot.rest.put(Routes.applicationCommands(bot.user?.id ?? config.bot.userid), {
            body: commandsArray
        })
    }
}

// @ts-ignore no-implicit-any
async function runEvent(bot: Bot, event: BotEvent, args: any) {
    try {
        await event.execute(bot, ...args)
        // @ts-ignore no-implicit-any
    } catch (e: any) {
        bot.log.error(`Event "${event.name}" (Trigger: "${event.event}") failed with error: ${e.message}\n${e.stack}`)
    }
}

const flatten = (arr: Array<any>): Array<any> => arr.reduce((flat, next) => flat.concat(Array.isArray(next) ? flatten(next) : next), [])