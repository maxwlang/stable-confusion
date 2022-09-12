import { expect } from 'chai'
import { Attachment } from 'discord.js'
import {getImageAttachmentURL, getRandomInt, validateHeight, validateWidth} from '../src/utils'

describe('Utils', () => {
    describe('getRandomInt', () => {
        it('should return a random integer within a specified range', () => {
            const result = getRandomInt(5, 10)
            expect(result).to.be.greaterThanOrEqual(5).and.lessThanOrEqual(10)
        })
    })

    describe('validateWidth', () => {
        it('should return a valid width when width is provided an acceptable input', () => {
            const result = validateWidth(246)
            expect(result).to.eq(246)
        })

        it('should return 512 when width is a number bigger than 1024', () => {
            const result = validateWidth(2048)
            expect(result).to.eq(512)
        })

        it('should return 512 when width is a number smaller than 128', () => {
            const result = validateWidth(10)
            expect(result).to.eq(512)
        })

        it('should return 512 when width is not provided', () => {
            const result = validateWidth(null)
            expect(result).to.eq(512)
        })

        it('should return 512 when width is not a number', () => {
            const result = validateWidth(NaN)
            expect(result).to.eq(512)
        })
    })

    describe('validateHeight', () => {
        it('should return a valid height when height is provided an acceptable input', () => {
            const result = validateHeight(246)
            expect(result).to.eq(246)
        })

        it('should return 512 when height is a number bigger than 1024', () => {
            const result = validateHeight(2048)
            expect(result).to.eq(512)
        })

        it('should return 512 when height is a number smaller than 128', () => {
            const result = validateHeight(10)
            expect(result).to.eq(512)
        })

        it('should return 512 when height is not provided', () => {
            const result = validateHeight(null)
            expect(result).to.eq(512)
        })

        it('should return 512 when width is not a number', () => {
            const result = validateWidth(NaN)
            expect(result).to.eq(512)
        })
    })

    describe('getImageAttachmentURL', () => {
        const imageAttachment: Attachment = {
            id: '000test',
            url: 'http://example.com/test.png',
            contentType: 'image/png',
            attachment: '',
            description: null,
            ephemeral: false,
            height: null,
            name: null,
            proxyURL: '',
            size: 0,
            spoiler: false,
            width: null,
            toJSON: function (): unknown {
                throw new Error('Function not implemented.')
            }
        }

        const jsonAttachment: Attachment = {
            id: '001test',
            url: 'http://example.com/test.json',
            contentType: 'application/json',
            attachment: '',
            description: null,
            ephemeral: false,
            height: null,
            name: null,
            proxyURL: '',
            size: 0,
            spoiler: false,
            width: null,
            toJSON: function (): unknown {
                throw new Error('Function not implemented.')
            }
        }

        it('should return an attachment URL correctly', () => {
            const result = getImageAttachmentURL(imageAttachment)
            expect(result).to.eq('http://example.com/test.png')
        })

        it('should return undefined on non-image attachments', () => {
            const result = getImageAttachmentURL(jsonAttachment)
            expect(result).to.be.undefined
        })

        it('should return undefined when no attachment is provided', () => {
            const result = getImageAttachmentURL(null)
            expect(result).to.be.undefined
        })
    })
})