import { APIApplicationCommandOptionChoice, SlashCommandBuilder } from 'discord.js';
import { BotCommand } from '../types';
export default function(): BotCommand {
    const command = new SlashCommandBuilder()
        .setName('imagine')
        .setDescription('Generate images from prompts')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('The prompt to generate an image with')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('width')
                .setMinValue(128)
                .setMaxValue(1024)
                .setDescription('The width of the generated image')
                .setChoices(
                    {name: '128px', value: 128},
                    {name: '256px', value: 256},
                    {name: '512px', value: 512},
                    {name: '768px', value: 768},
                    {name: '1024px', value: 1024}
                ))
        .addIntegerOption(option =>
            option.setName('height')
                .setMinValue(128)
                .setMaxValue(1024)
                .setDescription('The height of the generated image')
                .setChoices(
                    {name: '128px', value: 128},
                    {name: '256px', value: 256},
                    {name: '512px', value: 512},
                    {name: '768px', value: 768},
                    {name: '1024px', value: 1024}
                ))
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('Inital jpg or png image to generate variations of. Will be resized to the specified width and height'))
        .addAttachmentOption(option =>
            option.setName('mask')
                .setDescription('Black and white jpg or png image to use as mask for inpainting over init_image'))
        .addNumberOption(option =>
            option.setName('pstrength')
                .setDescription('Prompt strength when using init image. 1.0 corresponds to full destruction of information in image')
                .setMinValue(0)
                .setMaxValue(1))
        .addIntegerOption(option =>
            option.setName('numout')
                .setDescription('How many images to generate with this prompt')
                .setMinValue(1)
                .setMaxValue(4))
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