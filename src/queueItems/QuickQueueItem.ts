import { QueueItemTypes, QueueItem } from '.'
import { QueueItemConstructorInput } from './QueueItem'

export class QuickQueueItem extends QueueItem.QueueItem {
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