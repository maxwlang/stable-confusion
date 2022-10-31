import * as QueueItem from './QueueItem'
import * as QuickQueueItem from './QuickQueueItem'
// import * as RegeneratedQueueItem from './RegeneratedQueueItem'
// import * as VariantQueueItem from './VariantQueueItem'
// import * as UpscaledQueueItem from './UpscaledQueueItem'
// import * as ExtendedQueueItem from './ExtendedQueueItem'

export enum QueueItemTypes {
    Default = 'default',
    Quick = 'quick',
    Regenerated = 'regenerated',
    Variant = 'variant',
    Upscaled = 'upscaled',
    Extended = 'extended'
}

export type QueueItemInstances = QueueItem.QueueItem

export {
    QueueItem,
    QuickQueueItem,
    // RegeneratedQueueItem,
    // VariantQueueItem,
    // UpscaledQueueItem,
    // ExtendedQueueItem
}