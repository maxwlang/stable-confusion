import { QueueItemTypes, QueueItem } from '.'
import { QueueItemConstructorInput } from './QueueItem'

export class UpscaledQueueItem extends QueueItem.QueueItem {
    constructor(
        queueItemConstructorInput: QueueItemConstructorInput
    ) {
        super(queueItemConstructorInput)
    }

    public get type(): Readonly<QueueItemTypes> {
        return QueueItemTypes.Upscaled
    }

    // Number of images to generate
    public get numOutputs(): Readonly<number> {
        return 1
    }
}