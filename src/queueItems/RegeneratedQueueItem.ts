import { QueueItemTypes, QueueItem } from '.'
import { QueueItemConstructorInput } from './QueueItem'

export class RegeneratedQueueItem extends QueueItem.QueueItem {
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