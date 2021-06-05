/**
 * @jest-environment jsdom
 */
const app = require('../core.js').default
describe('licence plate number validation', () => {

    it('should identify a diplomatics car\'s plate number', () => {
        const result = app.extractCharacteristics('CD1443')

        const expected = { type: 'c', lastDigit: 3, province: 'C' }
        expect(result).toEqual(expected)
    })

    it('should identify a private car\'s plate number', () => {
        const result = app.extractCharacteristics('PDB1443')

        const expected = { type: 'c', lastDigit: 3, province: 'P' }
        expect(result).toEqual(expected)
    })

    it('should identify a bike\'s plate number', () => {
        const result = app.extractCharacteristics('PD144G')

        const expected = { type: 'b', lastDigit: 4, province: 'P' }
        expect(result).toEqual(expected)
    })
    
    it('should identify a bike\'s plate number', () => {
        const result = app.extractCharacteristics('PD144GASD')

        const expected = { type: null, lastDigit: null, province: 'P' }
        expect(result).toEqual(expected)
    })

})

describe('Restriction date and time validations', () => {
    it('should identify a non restricted timeframe to use a vehicle', () => {
        const isAbleToMove = app.isAbleToRide(9,'2021-06-04T20:48')
        expect(isAbleToMove).toBe(true)
    })
    it('should identify a non restricted timeframe to use a vehicle (2)', () => {
        const isAbleToMove = app.isAbleToRide(1,'2021-06-04T10:48')
        expect(isAbleToMove).toBe(true)
    })
    it('should identify a restricted timeframe to use a vehicle (first half)', () => {
        const isAbleToMove = app.isAbleToRide(9,'2021-06-04T08:18')
        expect(isAbleToMove).toBe(false)
    })
    it('should identify a restricted timeframe to use a vehicle (second half)', () => {
        const isAbleToMove = app.isAbleToRide(9,'2021-06-04T17:48')
        expect(isAbleToMove).toBe(false)
    })
    it('should identify as non restricted timeframe for a licence plate number that has no restriction a particular day (first half)', () => {
        const isAbleToMove = app.isAbleToRide(8,'2021-06-04T08:18')
        expect(isAbleToMove).toBe(true)
    })
    it('should identify as non restricted timeframe for a licence plate number that has no restriction a particular day (second half)', () => {
        const isAbleToMove = app.isAbleToRide(8,'2021-06-04T17:48')
        expect(isAbleToMove).toBe(true)
    })
})

describe('Input validations', () => {
    it('Correct date, incorrect licence plate number ', () => {
        const errs = app.inputHasErrors('ci8990b','2021-06-04T20:48').errs
        expect(errs).toBe(1)
    })
    it('Incorrect date, correct licence plate number', () => {
        const errs = app.inputHasErrors('CD8990',null).errs
        expect(errs).toBe(1)
    })
    it('Correct licence and date', () => {
        const errs = app.inputHasErrors('PWD0295','2021-06-04T20:48').errs
        expect(errs).toBe(0)
    })
    it('Incorrect date, incorrect licence plate number', () => {
        const errs = app.inputHasErrors('PW0295d',null).errs
        expect(errs).toBe(2)
    })
})