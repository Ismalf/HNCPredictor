const app = require('../core.js')
describe('Pico y Placa predictor', () => {

    it('should identify a diplomatics car\'s plate number', () => {
        const result = app.extractCharacteristics('CD1443')
        
        const expected = { type: 'c', lastDigit: '3' }
        expect(result).toEqual(expected)
    })

    it('should identify a private car\'s plate number', () => {
        const result = app.extractCharacteristics('PDB1443')
        
        const expected = { type: 'c', lastDigit: '3' }
        expect(result).toEqual(expected)
    })
    
    it('should identify a bike\'s plate number', () => {
        const result = app.extractCharacteristics('PD144G')
        
        const expected = { type: 'b', lastDigit: '4' }
        expect(result).toEqual(expected)
    })

})
