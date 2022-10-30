import { ActionRowBuilder, EmbedBuilder, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js'
import { Bot } from './bot'
import * as QueueItems from './queueItems'

// https://stackoverflow.com/a/40076355
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface BotCommand {
    command: any // Should be a variant of SlashCommandBuilder
    commandJson: RESTPostAPIApplicationCommandsJSONBody
    guilds?: string[] // Array of guild ids for guild specific commands
}

export interface BotEmbed {
    embeds: EmbedBuilder[]
    components?: ActionRowBuilder<any>[]
}

export interface BotEvent {
    name: string // Display name of event module
    event: string // Event name on discord
    once: boolean // Run once?
    execute: (
        bot: Bot,
        ...args: any[]
    ) => void | Promise<void>
}

export { QueueItems }