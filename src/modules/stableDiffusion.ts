import axios from 'axios'
import { isNil } from "ramda"
import { QueueItems } from '../types'

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

    public async processRequest(queueItem: QueueItems.QueueItemInstances): Promise<false | string[]> {
        if (this.processing) return false
        this.abortController = new AbortController()
        this.processing = true

        let body
        
        switch (queueItem.type) {
            case QueueItems.QueueItemTypes.Extended: {
                body = {
                    input: {
                        width: queueItem.width,
                        height: queueItem.height,
                        "init_image": queueItem.initImage,
                        "prompt_strength": queueItem.promptStrength,
                        "num_outputs": queueItem.numOutputs
                    }
                }
                break
            }

            case QueueItems.QueueItemTypes.Variant: {
                body = {
                    input: {
                        prompt: queueItem.prompt,
                        width: queueItem.width,
                        height: queueItem.height,
                        "init_image": queueItem.initImage,
                        "prompt_strength": queueItem.promptStrength,
                        "num_outputs": queueItem.numOutputs
                    }
                }
                break
            }

            default: {
                body = {
                    input: {
                        prompt: queueItem.prompt,
                        width: queueItem.width,
                        height: queueItem.height,
                        "init_image": queueItem.initImage,
                        mask: queueItem.mask,
                        "prompt_strength": queueItem.promptStrength,
                        "num_outputs": queueItem.numOutputs,
                        "num_inference_steps": queueItem.numInferenceSteps,
                        "guidance_scale": queueItem.guidanceScale,
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