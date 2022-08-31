import { SlashCommandBuilder } from 'discord.js';
import { BotCommand } from '../types';
export default function(): BotCommand {
    const command =  new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops a currently processing image')

    return {
        command,
        commandJson: command.toJSON()
    }
}

