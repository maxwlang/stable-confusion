import { SlashCommandBuilder } from 'discord.js';
import { BotCommand } from '../types';
export default function(): BotCommand {
    const command =  new SlashCommandBuilder()
        .setName('queue')
        .setDMPermission(false)
        .setDescription('Prompt queue')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('show')
                    .setDescription('Shows the current prompt queue')
                    .addUserOption(option => option.setName('user').setDescription('Show a specific user\'s requests')))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('details')
                    .setDescription('Shows details for a specific queue item')
                    .addStringOption(option => option.setName('uuid').setDescription('The prompt unique identifier').setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('remove')
                    .setDescription('Removes a prompt from the queue')
                    .addStringOption(option => option.setName('uuid').setDescription('The prompt unique identifier').setRequired(true)))

    return {
        command,
        commandJson: command.toJSON()
    }
}

