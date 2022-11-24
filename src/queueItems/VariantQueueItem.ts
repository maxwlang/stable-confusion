import { QueueItemTypes } from '.'
import { QueueItem, QueueItemConstructorInput } from './QueueItem'

export class VariantQueueItem extends QueueItem {
    constructor(
        queueItemConstructorInput: QueueItemConstructorInput
    ) {
        super(queueItemConstructorInput)
    }

    public get type(): Readonly<QueueItemTypes> {
        return QueueItemTypes.Variant
    }
}