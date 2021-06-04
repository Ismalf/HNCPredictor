'usestrict';

const check = () => {
    const el = document.getElementById('results')
    el.classList.add('grow')
    el.innerHTML = 'Ok JS'
    console.log(extractCharacteristics('II2234'))

}

const extractCharacteristics = (plate) => {
    
    const characteristics = {
        type: null, // To Know if it's a car or a bike
        lastDigit: null // The plate last digit
    }

    const carPlatePattern = /[A-Z]{2,3}[0-9]{4}/ // cars
    const bikePlatePattern = /[A-Z]{2}[0-9]{3}[A-Z]{1}/ // bikes
    
    if (carPlatePattern.test(plate)) {
        characteristics.type = 'c'
        characteristics.lastDigit = plate[plate.length - 1]
    } else if (bikePlatePattern.test(plate)) {
        characteristics.type = 'b'
        characteristics.lastDigit = plate[plate.length - 2]
    } 
    return characteristics
}
