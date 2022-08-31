import { Interaction } from 'discord.js'
import { Bot } from '../bot'
import { BotEvent } from '../types'

const botEvent: BotEvent = {
    name: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return

        if (interaction.commandName === 'ping') {
          await interaction.reply('Pong!')
        }
    }
}

export default botEvent
