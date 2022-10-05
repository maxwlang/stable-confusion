import { SlashCommandBuilder } from 'discord.js';
import { BotCommand } from '../types';
export default function(): BotCommand {
    const command = new SlashCommandBuilder()
        .setName('extend')
        .setDMPermission(false)
        .setDescription('Generate images from a base image without a prompt')
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('Inital jpg or png image to generate variations of. Will be resized to the specified width and height')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('mask')
                .setDescription('Black and white jpg or png image to use as mask for inpainting over init_image'))
        .addNumberOption(option =>
            option.setName('pstrength')
                .setDescription('Prompt strength when using init image. 1.0 corresponds to full destruction of information in image')
                .setMinValue(0)
                .setMaxValue(1))
        .addIntegerOption(option =>
            option.setName('numsteps')
            .setDescription('Number of denoising steps. Default 50')
            .setMinValue(1)
            .setMaxValue(500))
        .addNumberOption(option =>
            option.setName('guidescale')
            .setDescription('Scale for classifier-free guidance. Default 7.5')
            .setMinValue(1)
            .setMaxValue(20))
        .addIntegerOption(option =>
            option.setName('seed')
            .setDescription('Generation seed. Randomized if not provided')
            .setMinValue(0)
            .setMaxValue(999999999))

    return {
        command,
        commandJson: command.toJSON()
    }
}