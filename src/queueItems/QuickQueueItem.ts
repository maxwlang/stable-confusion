import { QueueItemTypes, QueueItem } from '.'
import { QueueItemConstructorInput } from './QueueItem'

export class QuickQueueItem extends QueueItem.QueueItem {
    constructor(
        queueItemConstructorInput: QueueItemConstructorInput,
        quickQueueItemConstructorInput: unknown /* QuickQueueItemConstructorInput */
    ) {
        super(queueItemConstructorInput)

        // @ts-expect-error TODO: Figure out how to get this functional
        this._type = QueueItemTypes.Quick // Set type to quick QueueItem
    }


    // QuickQueueItem specific properties
    public test: string | undefined
}