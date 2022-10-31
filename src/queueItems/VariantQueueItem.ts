import { QueueItem } from '.'
import { QueueItemConstructorInput } from './QueueItem'

export type VariantQueueItemConstructorInput = {
    // Whatever
}

export class VariantQueueItem extends QueueItem.QueueItem {
    constructor(
        queueItemConstructorInput: QueueItemConstructorInput,
        variantQueueItemConstructorInput: VariantQueueItemConstructorInput
    ) {
        super(queueItemConstructorInput)

        // Other stuff?!!?!
        console.log('test')
    }

    public test: string | undefined
}


// In variantQueueItem class, have a method that takes values from other queueItem types.
// Carry this over to remaining queueItem variants
// Ex: new VariantQueueItem().fromQueueItem(myQueueItem)

// export type VariantQueueItemMetadata = {
//     discordOwnerSnowflake: string
//     messageIdSnowflake: string
//     somethingVariantSpecific: string
// }

// export type VariantQueueItemPrediction = {
//     prompt?: string
//     width: number
//     height: number
//     somethingVariantSpecific: number
// }

// export class VariantQueueItem implements QueueItem {
//     constructor(
//         metadata: VariantQueueItemMetadata,
//         prediction: VariantQueueItemPrediction
//     ) {
//         this.metadata = metadata
//         this.prediction = prediction
//     }

//     public type: QueueItemTypes = QueueItemTypes.Variant
//     public metadata: VariantQueueItemMetadata
//     public prediction: VariantQueueItemPrediction
// }



// =========

// import { v4 as uuidv4 } from 'uuid'
// import { getRandomInt } from '../utils'
// import { ChatInputCommandInteraction } from "discord.js"
// import { QueueItemTypes } from '.'


// export type QueueItemBody = {
//     input: {
//         prompt?: string // Prompt text
//         width: number // Image size, min 64
//         height: number // Image size, min 64
//         "init_image": string | undefined // Starter image to generate from
//         mask: string | undefined // Mask image to generate with
//         "prompt_strength": number // 0 - 1 float value, default 0.8
//         "num_outputs": number // Number of images to generate, default 1
//         "num_inference_steps": number // Number of steps, default 50
//         "guidance_scale": number // Default 7.5
//         seed: number // RNG numeric seed
//     }
// }

// export type QueueItemConstructorInput = Omit<QueueItemBody['input'],
//     'init_image | prompt_strength | num_outputs | num_inference_steps | guidance_scale'
// > & {
//     initImage?: string
//     promptStrength: number
//     numOutputs: number
//     numInferenceSteps: number
//     guidanceScale: number

//     discordCallerSnowflake: string
//     discordMessageSnowflake: string
//     discordInteraction: ChatInputCommandInteraction
// }

// export type QueueItemMutationInput = Partial<QueueItemConstructorInput>

// export class QueueItem {
//     constructor(queueItemConstructorInput: QueueItemConstructorInput) {
//         this.uuid = uuidv4() // Request identifier
//         this.seed = queueItemConstructorInput.seed ?? getRandomInt(1, 99999999) // Generation seed
//         this.discordCallerSnowflake = queueItemConstructorInput.discordCallerSnowflake
//         this.discordMessageSnowflake = queueItemConstructorInput.discordMessageSnowflake
//         this.discordInteraction = queueItemConstructorInput.discordInteraction

//         this.prompt = queueItemConstructorInput.prompt ?? undefined
//         this.width = queueItemConstructorInput.width ?? 0
//         this.height = queueItemConstructorInput.height ?? 0
//         this.initImage = queueItemConstructorInput.initImage ?? undefined
//         this.mask = queueItemConstructorInput.mask ?? undefined
//         this.promptStrength = queueItemConstructorInput.promptStrength ?? 0.8
//         this.numOutputs = 4 // This might always need to be 4 due to variant / quad preview support.
//         this.numInferenceSteps = queueItemConstructorInput.numInferenceSteps ?? 50
//         this.guidanceScale = queueItemConstructorInput.guidanceScale ?? 7.5
//     }

//     // Metadata
//     public readonly uuid: string
//     public readonly type: QueueItemTypes = QueueItemTypes.Default
//     public readonly imageData?: Buffer[]
//     public readonly discordCallerSnowflake: string
//     public readonly discordMessageSnowflake: string
//     public readonly discordInteraction: ChatInputCommandInteraction
    
//     // Prediction
//     public readonly seed: number
//     public readonly prompt?: string // Prompt text
//     public readonly width: number // Image size, min 64
//     public readonly height: number // Image size, min 64
//     public readonly initImage?: string // Starter image to generate from
//     public readonly mask?: string // Mask image to generate with
//     public readonly promptStrength: number // 0 - 1 float value, default 0.8
//     public readonly numOutputs: number // Number of images to generate
//     public readonly numInferenceSteps: number // Number of steps, default 50
//     public readonly guidanceScale: number // Default 7.5

    
//     public mutateQueueItem(QueueItemMutationInput: QueueItemMutationInput) {
//         // Takes current QueueItem and modifies any values provided in QueueItemMutationInput 
//     }

//     public createStableDiffusionRequestBody(): QueueItemBody {
//         // This creates the stable diffusion request body that the
//         // stable diffusion model takes as input
//         return {
//             input: {
//                 prompt: this.prompt,
//                 width: this.width,
//                 height: this.height,
//                 "init_image": this.initImage,
//                 mask: this.mask,
//                 "prompt_strength": this.promptStrength,
//                 "num_outputs": this.numOutputs,
//                 "num_inference_steps": this.numInferenceSteps,
//                 "guidance_scale": this.guidanceScale,
//                 seed: this.seed
//             }
//         }
//     }
// }
