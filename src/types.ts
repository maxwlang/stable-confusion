import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, RESTPostAPIApplicationCommandsJSONBody, SlashCommandBuilder } from 'discord.js'
import { Bot } from './bot'

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

export enum QueueItemType {
    Default,
    Quick,
    Regenerated,
    Variant,
    Upscaled
}

export interface QueueItem {
    uuid: string // Unique queue uuid
    seed: number // RNG
    type: QueueItemType
    messageId?: string // Discord main message snowflake ID.
    interaction: ChatInputCommandInteraction
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