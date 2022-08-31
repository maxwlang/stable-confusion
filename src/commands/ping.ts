import { SlashCommandBuilder } from 'discord.js';
import { BotCommand } from '../types';
export default function(): BotCommand {
    const command = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pings the bot.')

    return {
        command,
        commandJson: command.toJSON()
    }
}
