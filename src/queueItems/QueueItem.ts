import { v4 as uuidv4 } from 'uuid'
import { getRandomInt } from '../utils'
import { ChatInputCommandInteraction, Snowflake } from "discord.js"
import { QueueItemTypes } from '.'
import { isEmpty, isNil } from 'ramda'

export type QueueItemBody = {
    input: {
        prompt?: string // Prompt text
        width: number // Image size, min 64
        height: number // Image size, min 64
        "init_image": string | undefined // Starter image to generate from
        mask: string | undefined // Mask image to generate with
        "prompt_strength": number // 0 - 1 float value, default 0.8
        "num_outputs": number // Number of images to generate, default 1
        "num_inference_steps": number // Number of steps, default 50
        "guidance_scale": number // Default 7.5
        seed: number // RNG numeric seed
    }
}

export type QueueItemConstructorInput = {
    discordCallerSnowflake: Snowflake // Discord snowflake of invoking user
    discordMessageSnowflake?: Snowflake // Discord snowflake of Stable Confusion's related message embed
    discordInteraction: ChatInputCommandInteraction // Discord interaction handle for QueueItem

    prompt?: string // Prompt text
    width: number // Image size, min 64
    height: number // Image size, min 64
    initImage: string | undefined // Starter image to generate from
    mask: string | undefined // Mask image to generate with
    promptStrength?: number | null // 0 - 1 float value, default 0.8
    numInferenceSteps?: number | null // Number of steps, default 50
    guidanceScale?: number | null // Default 7.5
    seed?: number | null // RNG numeric seed
}

export type QueueItemMutationInput = Partial<QueueItemConstructorInput>

export class QueueItem {
    constructor(queueItemConstructorInput: QueueItemConstructorInput) {
        if (queueItemConstructorInput.height && (queueItemConstructorInput.height > 2048 || queueItemConstructorInput.height < 64)) {
            throw new Error('Invalid QueueItem height provided. Must be >= 64 || <= 2048.')
        }

        if (queueItemConstructorInput.width && (queueItemConstructorInput.width > 2048 || queueItemConstructorInput.height < 64)) {
            throw new Error('Invalid QueueItem width provided. Must be >= 64 || <= 2048.')
        }

        if (queueItemConstructorInput.promptStrength && (queueItemConstructorInput.promptStrength > 1 || queueItemConstructorInput.height < 0)) {
            throw new Error('Invalid QueueItem promptStrength provided. Must be >= 0 || <= 1.')
        }

        this._uuid = uuidv4() // Request identifier
        this._seed = queueItemConstructorInput.seed ?? getRandomInt(1, 99999999) // Generation seed
        this._discordCallerSnowflake = queueItemConstructorInput.discordCallerSnowflake
        this._discordMessageSnowflake = queueItemConstructorInput.discordMessageSnowflake
        this._discordInteraction = queueItemConstructorInput.discordInteraction

        this._prompt = queueItemConstructorInput.prompt ?? undefined
        this._width = queueItemConstructorInput.width ?? 64
        this._height = queueItemConstructorInput.height ?? 64
        this._initImage = queueItemConstructorInput.initImage ?? undefined
        this._mask = queueItemConstructorInput.mask ?? undefined
        this._promptStrength = queueItemConstructorInput.promptStrength ?? 0.8
        this._numOutputs = 4 // This should always be 4 here due to variant / quad preview support.
        this._numInferenceSteps = queueItemConstructorInput.numInferenceSteps ?? 50
        this._guidanceScale = queueItemConstructorInput.guidanceScale ?? 7.5
    }

    /* == Metadata == */

    private _uuid: string
    public get uuid(): Readonly<string> {
        return this._uuid
    }

    private _type: QueueItemTypes = QueueItemTypes.Default
    public get type(): Readonly<QueueItemTypes> {
        return this._type
    }

    private _imageData?: Buffer[]
    public get imageData(): Buffer[] | undefined {
        return this._imageData
    }
    public set imageData(imageData: Buffer[] | undefined) {
        if (isNil(imageData) || isEmpty(imageData)) {
            throw new Error('A valid populated buffer array must be provided.')
        }

        this._imageData = imageData
    }

    private _discordCallerSnowflake: string
    public get discordCallerSnowflake(): Readonly<string> {
        return this._discordCallerSnowflake
    }

    private _discordMessageSnowflake?: string
    public get discordMessageSnowflake(): Snowflake | undefined {
        return this._discordMessageSnowflake
    }
    public set discordMessageSnowflake(snowflake: Snowflake | undefined) {
        if (isNil(snowflake)) {
            throw new Error('A snowflake must be provided.')
        }

        this._discordCallerSnowflake = snowflake
    }

    private _discordInteraction: ChatInputCommandInteraction
    public get discordInteraction(): Readonly<ChatInputCommandInteraction> {
        return this._discordInteraction
    }

    /* == Prediction == */

    private _seed: number
    public get seed(): Readonly<number> {
        return this._seed
    }

    // Prompt text
    private _prompt?: string
    public get prompt(): Readonly<string | undefined> {
        return this._prompt
    }

    // Image size, min 64
    private _width: number
    public get width(): Readonly<number> {
        return this._width
    }

    // Image size, min 64
    private _height: number
    public get height(): Readonly<number> {
        return this._height
    }

    // Starter image to generate from
    private _initImage?: string
    public get initImage(): Readonly<string | undefined> {
        return this._initImage
    }

    // Mask image to generate with
    private _mask?: string
    public get mask(): Readonly<string | undefined> {
        return this._mask
    }

    // 0 - 1 float value, default 0.8
    private _promptStrength: number
    public get promptStrength(): Readonly<number> {
        return this._promptStrength
    }

    // Number of images to generate
    private _numOutputs: number
    public get numOutputs(): Readonly<number> {
        return this._numOutputs
    }

    // Number of steps, default 50
    private _numInferenceSteps: number
    public get numInferenceSteps(): Readonly<number> {
        return this._numInferenceSteps
    }

    // Default 7.5
    private _guidanceScale: number
    public get guidanceScale(): Readonly<number> {
        return this._guidanceScale
    }

    /**
     * Creates a new random seed and assigns to QueueItem
     */
    public shuffleSeed() {
        this._seed = getRandomInt(1, 99999999)
    }

    /**
     * Ceates the Stable Diffusion request body that the Stable Diffusion module sends to the model 
     * @returns A QueueItem body formatted for Stable Diffusion input
     */
    public createStableDiffusionRequestBody(): QueueItemBody {

        return {
            input: {
                prompt: this._prompt,
                width: this._width,
                height: this._height,
                "init_image": this._initImage,
                mask: this._mask,
                "prompt_strength": this._promptStrength,
                "num_outputs": this._numOutputs,
                "num_inference_steps": this._numInferenceSteps,
                "guidance_scale": this._guidanceScale,
                seed: this._seed
            }
        }
    }
}
