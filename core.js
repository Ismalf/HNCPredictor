
const START_OF_RESTRICTION_FIRST_HALF = 700 // As 7:00 AM but easier to compare
const END_OF_RESTRICTION_FIRST_HALF = 930 // As 9:30 AM but easier to compare

const START_OF_RESTRICTION_SECOND_HALF = 1600 // As 4:00 PM but easier to compare
const END_OF_RESTRICTION_SECOND_HALF = 1930 // As 7:30 PM but easier to compare

const plateNumberInput = document.getElementById('plateNumber')
const circulationDateTimeInput = document.getElementById('circulationDateTime')
const results = document.getElementById('results')

const check = () => {
    reset()
    const { plateNumber, date } = getInputValues()
    const errs = inputHasErrors(plateNumber, date)
    if (errs.errs) {
        errs.inputWErr.forEach(input => setState(input, true, false))
        return
    }
    const prediction = getPrediction(extractCharacteristics(plateNumber), date)
    showPrediction(prediction)
}

const setState = (input = null, hasErrors = false, isReset = true, message = null) => {
    if (isReset) {
        input.classList.remove('inputOk')
        input.classList.remove('inputErr')
        input.value = ''
    } else {
        if (hasErrors) {
            input.classList.remove('inputOk')
            input.classList.add('inputErr')
            if (input === plateNumberInput) {
                document.getElementById('plateNumberErr').innerHTML = message ?? 'Please enter a valid licence plate number'
            } else {
                document.getElementById('circulationDateTimeErr').innerHTML = message ?? 'Please enter a valid date'
            }
        } else {
            input.classList.remove('inputErr')
            input.classList.add('inputOk')
            document.getElementById('plateNumberErr').innerHTML = ''
            document.getElementById('circulationDateTimeErr').innerHTML = ''
        }
    }
}

const getInputValues = () => {
    const plateNumber = plateNumberInput.value
    const date = circulationDateTimeInput.value
    return { plateNumber, date }
}

const inputHasErrors = (plate, date) => {
    let errs = 0
    let inputWErr = []
    if (!plate || !/^[A-Z]{2,3}[0-9]{3,4}[A-Z]{0,1}$/.test(plate)) {
        errs++
        inputWErr.push(plateNumberInput)
    }
    if (!date) {
        errs++
        inputWErr.push(circulationDateTimeInput)
    }
    return { errs, inputWErr }
}

const checkLNP = () => {
    if (!plateNumberInput.value) {
        setState(plateNumberInput, true, false, 'Licence plate number is required')
    } else if (!/^[A-Z]{2,3}[0-9]{3,4}[A-Z]{0,1}$/.test(plateNumberInput.value))
        setState(plateNumberInput, true, false, 'Incorrect format for licence plate number')
    else
        setState(plateNumberInput, false, false, 'Incorrect format for licence plate number')
}

const checkDate = () => {
    if (!circulationDateTimeInput.value)
        setState(circulationDateTimeInput, true, false, 'A date is required')
    else
        setState(circulationDateTimeInput, false, false, 'A date is required')
}

const getPrediction = (characteristics, date) => {

    const vhType = `Vehicle type: ${characteristics.type === 'c' ? 'Car' : 'Motor bike'}`
    const province = `${characteristics.province === 'P' ? 'From' : 'Visiting'}: Pichincha`
    const canBeOnRoad = isAbleToRide(characteristics.lastDigit, date) ? 'You are able to use your vehicle' : 'You are not able to use your vehicle'
    return `${vhType} <br/> ${province} <br/> ${canBeOnRoad}`

}

const isAbleToRide = (lastDigit, date) => {
    const dateTime = new Date(date)
    console.log(date)
    const dayOfWeek = dateTime.getDay()
    const hour = dateTime.getHours() * 100 + dateTime.getMinutes()
    if (!((START_OF_RESTRICTION_FIRST_HALF <= hour && END_OF_RESTRICTION_FIRST_HALF > hour)
        || (START_OF_RESTRICTION_SECOND_HALF <= hour && END_OF_RESTRICTION_SECOND_HALF > hour))) {
        return true
    }
    switch (dayOfWeek) {
        case 1:
            return lastDigit !== 1 && lastDigit !== 2
        case 2:
            return lastDigit !== 3 && lastDigit !== 4
        case 3:
            return lastDigit !== 5 && lastDigit !== 6
        case 4:
            return lastDigit !== 7 && lastDigit !== 8
        case 5:
            return lastDigit !== 9 && lastDigit !== 0
        default:
            return true
    }
}

const extractCharacteristics = (plate) => {

    const characteristics = {
        type: null, // To Know if it's a car or a bike
        lastDigit: null, // The plate last digit
        province: null
    }

    const carPlatePattern = /^[A-Z]{2,3}[0-9]{4}$/ // cars
    const bikePlatePattern = /^[A-Z]{2}[0-9]{3}[A-Z]{1}$/ // bikes

    if (carPlatePattern.test(plate)) {
        characteristics.type = 'c'
        characteristics.lastDigit = +plate[plate.length - 1]
    } else if (bikePlatePattern.test(plate)) {
        characteristics.type = 'b'
        characteristics.lastDigit = +plate[plate.length - 2]
    }
    characteristics.province = plate[0]
    return characteristics
}

const showPrediction = (prediction) => {
    results.classList.add('grow')
    results.innerHTML = prediction
}

const reset = (newSearch = true) => {
    const results = document.getElementById('results')
    results.classList.remove('grow')
    results.innerHTML = ''
    setState(plateNumberInput, false, !newSearch)
    setState(circulationDateTimeInput, false, !newSearch)
}

module.exports.default = { extractCharacteristics, inputHasErrors, isAbleToRide }