import { Interaction } from 'discord.js'
import { isNil } from 'ramda'
import { Bot } from '../bot'
import queueDetails from '../embeds/queueDetails'
import { BotEvent } from '../types'

const botEvent: BotEvent = {
    name: 'Command Handler - Queue Details',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName !== 'queue') return
        if (interaction.options.getSubcommand() !== 'details') return

        const uuid = interaction.options.getString('uuid', true)
        const queueItem = bot.findQueue(uuid)
        if (isNil(queueItem)) {
            await interaction.reply('No queue item found with provided prompt ID.')
            return
        }

        const queueDetailsEmbed = queueDetails(queueItem)

        await interaction.reply({
            embeds: queueDetailsEmbed.embeds
        })
    }
}

export default botEvent
