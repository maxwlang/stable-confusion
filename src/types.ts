import { ActionRowBuilder, EmbedBuilder, RESTPostAPIApplicationCommandsJSONBody, SlashCommandBuilder } from 'discord.js'
import { Bot } from './bot'

export interface BotCommand {
    command: SlashCommandBuilder
    commandJson: RESTPostAPIApplicationCommandsJSONBody
    guilds?: string[] // Array of guild ids for guild specific commands
}

export interface BotEmbed {
    embeds: EmbedBuilder[]
    components?: ActionRowBuilder[]
}

export interface BotEvent {
    name: string // Event name, used by caller.
    once: boolean // Run once?
    execute: (
        bot: Bot,
        ...args: any[]
    ) => void | Promise<void>
}

export interface QueueItem {
    uuid: string // Unique queue uuid
    seed: string // RNG, numeric?
    discordCaller: string // Snowflake of caller for command
    prediction: {
        prompt: string // Prompt text
        width: number // Image size, min 64
        height: number // Image size, min 64
        initImage: string | undefined // Starter image to generate from
        mask: string | undefined // Mask image to generate with
        promptStrength: number // 0 - 1 float value, default 0.8
        numOutputs: number  // Number of images to generate, default 1
        numInferenceSteps: number // Number of steps, default 50
        guidanceScale: number // Default 7.5
    }
}