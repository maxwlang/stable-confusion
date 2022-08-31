import { Interaction } from 'discord.js'
import { isNil } from 'ramda'
import { Bot } from '../bot'
import queueDetails from '../embeds/queueDetails'
import { BotEvent } from '../types'

const botEvent: BotEvent = {
    name: 'Command Handler - Queue Remove',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName !== 'queue') return
        if (interaction.options.getSubcommand() !== 'remove') return

        const isAdminRequest = bot.config.admin.users.includes(interaction.user.id)
        const uuid = interaction.options.getString('uuid', true)
        const queueItem = bot.findQueue(uuid)
        if (isNil(queueItem)) {
            await interaction.reply('No queue item found with provided prompt ID.')
            return
        }

        if (interaction.user.id !== queueItem.discordCaller && !isAdminRequest) {
            await interaction.reply('You do not own this queue item.')
            return
        }

        const deletedItems = bot.removeQueue(uuid)
        const queueDetailsEmbed = queueDetails(deletedItems[0])

        await interaction.reply({
            content: `The following queue item has been deleted. ${isAdminRequest ? '[Admin Delete]' : ''}`,
            embeds: queueDetailsEmbed.embeds
        })
    }
}

export default botEvent
