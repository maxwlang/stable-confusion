import { SlashCommandBuilder } from 'discord.js';
import { BotCommand } from '../types';
export default function(): BotCommand {
    const command = new SlashCommandBuilder()
        .setName('imagine')
        .setDescription('Generate images from prompts.')

    return {
        command,
        commandJson: command.toJSON()
    }
}
