import { SlashCommandBuilder } from 'discord.js';
import { BotCommand } from '../types';
export default function(): BotCommand {
    const command = new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads the bot')
    
    return {
        command,
        commandJson: command.toJSON()
    }
}
