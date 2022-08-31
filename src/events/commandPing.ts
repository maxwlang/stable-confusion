import { Interaction } from 'discord.js'
import { Bot } from '../bot'
import { BotEvent } from '../types'

const botEvent: BotEvent = {
    name: 'Command Handler - Ping',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName !== 'ping') return

        await interaction.reply('Pong!')
    }
}

export default botEvent
