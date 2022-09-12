import { expect } from 'chai'
import imagineCommandRegisterFunction from '../../src/commands/imagine'
import { imagineCommandJson } from '../support/commandJson'

describe('Bot Command - Imagine', () => {
    describe('Command Registration', () => {
        it('should export a function', () => {
            expect(typeof imagineCommandRegisterFunction).to.eq('function')
        })

        it('should return a bot command registration object when returned', () => {
            const registrationObject = imagineCommandRegisterFunction()
            expect(registrationObject).to.have.keys('command', 'commandJson')
        })

        it('should match expected command JSON', () => {
            const registrationObject = imagineCommandRegisterFunction()
            expect(registrationObject.commandJson).to.deep.eq(imagineCommandJson)
        })
    })

    // describe('Command Handler', () => {
    //     // the file in ./src/events/commandImagine.ts
    //     it('should', () => {
    //         expect(true).to.be.true
    //     })
    // })
})