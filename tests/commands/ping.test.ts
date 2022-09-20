import { expect } from 'chai'
import { pingCommandJson } from '../support/commandJson'
import pingCommandRegisterFunction from '../../src/commands/ping'

describe('Bot Command - Ping', () => {
    describe('Command Registration', () => {
        it('should export a function', () => {
            expect(typeof pingCommandRegisterFunction).to.eq('function')
        })

        it('should return a bot command registration object when returned', () => {
            const registrationObject = pingCommandRegisterFunction()
            expect(registrationObject).to.have.keys('command', 'commandJson')
        })

        it('should match expected command JSON', () => {
            const registrationObject = pingCommandRegisterFunction()
            console.log(registrationObject.commandJson)
            expect(registrationObject.commandJson).to.deep.eq(pingCommandJson)
        })
    })
})