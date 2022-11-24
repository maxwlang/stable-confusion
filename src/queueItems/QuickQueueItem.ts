import { QueueItemTypes } from '.'
import { QueueItem, QueueItemConstructorInput } from './QueueItem'

export class QuickQueueItem extends QueueItem {
    constructor(
        queueItemConstructorInput: QueueItemConstructorInput
    ) {
        super(queueItemConstructorInput)
    }

    public get type(): Readonly<QueueItemTypes> {
        return QueueItemTypes.Quick
    }

    // Number of images to generate
    public get numOutputs(): Readonly<number> {
        return 1
    }
}