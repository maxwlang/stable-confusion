import { QueueItemTypes } from '.'
import { QueueItem, QueueItemConstructorInput } from './QueueItem'

export class RegeneratedQueueItem extends QueueItem {
    constructor(
        queueItemConstructorInput: QueueItemConstructorInput
    ) {
        super(queueItemConstructorInput)
        this.shuffleSeed()
    }

    public get type(): Readonly<QueueItemTypes> {
        return QueueItemTypes.Regenerated
    }
}