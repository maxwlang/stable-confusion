import { QueueItem, QueueItemType } from "../types"
import axios from 'axios'
import { isNil } from "ramda"

export default class StableDiffusion {
    constructor(host: string, port: number) {
        this.host = host
        this.port = port
    }

    private host: string
    private port: number
    private processing: boolean = false
    private abortController: AbortController | undefined
    
    public isProcessing = () => this.processing

    public async processRequest(queueItem: QueueItem): Promise<false | string[]> {
        if (this.processing) return false
        this.abortController = new AbortController()
        this.processing = true

        let body
        
        switch (queueItem.type) {
            case QueueItemType.Extended: {
                body = {
                    input: {
                        width: queueItem.prediction.width,
                        height: queueItem.prediction.height,
                        "init_image": queueItem.prediction.initImage,
                        "prompt_strength": queueItem.prediction.promptStrength,
                        "num_outputs": queueItem.prediction.numOutputs
                    }
                }
        
            }

            case QueueItemType.Variant: {
                body = {
                    input: {
                        prompt: queueItem.prediction.prompt,
                        width: queueItem.prediction.width,
                        height: queueItem.prediction.height,
                        "init_image": queueItem.prediction.initImage,
                        "prompt_strength": queueItem.prediction.promptStrength,
                        "num_outputs": queueItem.prediction.numOutputs
                    }
                }
                break
            }

            default: {
                body = {
                    input: {
                        prompt: queueItem.prediction.prompt,
                        width: queueItem.prediction.width,
                        height: queueItem.prediction.height,
                        "init_image": queueItem.prediction.initImage,
                        mask: queueItem.prediction.mask,
                        "prompt_strength": queueItem.prediction.promptStrength,
                        "num_outputs": queueItem.prediction.numOutputs,
                        "num_inference_steps": queueItem.prediction.numInferenceSteps,
                        "guidance_scale": queueItem.prediction.guidanceScale,
                        seed: queueItem.seed
                    }
                }
            }
        }

        const results = await axios.post(`${this.host}:${this.port ?? 5000}/predictions`, body, {
            headers: {'Content-Type': 'application/json'}
        }).catch(e => {
            return null
        })

        this.processing = false
        if (isNil(results) || isNil(results.data)) return false
        return results.data.output as string[]
    }

    public cancelRequest(): boolean | undefined {
        if (!this.abortController) throw new Error('No active abort controller')
        if (!this.processing) return false
        
        this.abortController.abort()
        this.processing = false
        return true
    }
}