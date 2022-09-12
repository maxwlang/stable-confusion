import { Attachment } from "discord.js";
import { isNil } from "ramda";

export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export const validateWidth = (width: number | null): number => {
    if (isNil(width) || typeof width !== 'number' || isNaN(width) || width < 128 || width > 1024) return 512
    return width
  }
  
export const validateHeight = (height: number | null): number => {
    if (isNil(height) || typeof height !== 'number' || isNaN(height) || height < 128 || height > 1024) return 512
    return height
}

export const getImageAttachmentURL = (attachment: Attachment | null): string | undefined => {
    const imageMimes = ['image/jpeg', 'image/jpg', 'image/png']
    if (isNil(attachment) || isNil(attachment.contentType)) return
    if (!imageMimes.includes(attachment.contentType)) return
    return attachment.url
}