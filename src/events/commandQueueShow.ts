import { Interaction, InteractionResponse } from 'discord.js'
import { isEmpty, isNil } from 'ramda'
import { Bot } from '../bot'
import queueShow from '../embeds/queueShow'
import { BotEvent } from '../types'

// TODO: Needs paging

const botEvent: BotEvent = {
    name: 'Command Handler - Queue Show',
    event: 'interactionCreate',
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (!interaction.isChatInputCommand() /* or is a button interaction we want */) return
        if (interaction.commandName !== 'queue') return
        if (interaction.options.getSubcommand() !== 'show') return

        let queueItems = bot.queue
        const userFilter = interaction.options.getUser('user')
        if (!isNil(userFilter)) {
            queueItems = bot.queue.filter(queueItem => queueItem.discordCallerSnowflake === userFilter.id)

            if (isEmpty(queueItems)) {
                await interaction.reply('This user has no queue items.')
                return
            }
        }

        if (isNil(queueItems) || isEmpty(queueItems)) {
            await interaction.reply('There no prompts in queue.')
            return
        }

        const queueShowEmbed = queueShow({
            positions: [0, 1, 3],
            queueItems
        })

        await interaction.reply({
            embeds: queueShowEmbed.embeds,
            components: queueShowEmbed.components
        })
    }
}

export default botEvent
