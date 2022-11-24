import * as ExtendedQueueItem from './ExtendedQueueItem'
import * as QueueItem from './QueueItem'
import * as QuickQueueItem from './QuickQueueItem'
import * as RegeneratedQueueItem from './RegeneratedQueueItem'
import * as UpscaledQueueItem from './UpscaledQueueItem'
import * as VariantQueueItem from './VariantQueueItem'

export enum QueueItemTypes {
    Default = 'default',
    Quick = 'quick',
    Regenerated = 'regenerated',
    Variant = 'variant',
    Upscaled = 'upscaled',
    Extended = 'extended'
}

export type QueueItemInstances = 
    QueueItem.QueueItem |
    QuickQueueItem.QuickQueueItem |
    RegeneratedQueueItem.RegeneratedQueueItem |
    VariantQueueItem.VariantQueueItem |
    UpscaledQueueItem.UpscaledQueueItem |
    ExtendedQueueItem.ExtendedQueueItem

export {
    QueueItem,
    QuickQueueItem,
    RegeneratedQueueItem,
    VariantQueueItem,
    UpscaledQueueItem,
    ExtendedQueueItem
}
