//#region  Constant values definition 

// Start and end hours for 'Pico y Placa' are treated as integer numbers
// multiplying the hour by 100 and adding the minutes
// so it's easier to check if the date and time entered by the user
// is restricted
const START_OF_RESTRICTION_FIRST_HALF = 700 // same as 7:00 AM but easier to compare
const END_OF_RESTRICTION_FIRST_HALF = 930 // same as 9:30 AM but easier to compare

const START_OF_RESTRICTION_SECOND_HALF = 1600 // same as 4:00 PM but easier to compare
const END_OF_RESTRICTION_SECOND_HALF = 1930 // same as 7:30 PM but easier to compare

const plateNumberInput = document.getElementById('plateNumber')
const circulationDateTimeInput = document.getElementById('circulationDateTime')
const results = document.getElementById('results')
//#endregion

/**
 * Entry point to check if a licence plate number and date time is forbidden
 * to move around the city of Quito
 * "Main" function of the program
 * @returns void
 */
const check = () => {
    reset() // first clear all the values that are not required yet, such as the final prediction message
    const { plateNumber, date } = getInputValues() 
    const errs = inputHasErrors(plateNumber, date) 
    // Values are validated as soon as the user triggers the blur event on an input field
    // But either way the prediction is aborted if there are still errors on the inputs
    if (errs.errs) {
        // show errors on the form and abort the process
        errs.inputWErr.forEach(input => setState(input, true, false))
        return
    }
    const prediction = getPrediction(extractCharacteristics(plateNumber), date) // Get the prediction from the input data
    
    showPrediction(prediction) // output the prediction to HTML
}

/**
 * If an input has errors this method adds the respective css classes and messages on the form
 * @param {*} input Target Input
 * @param {*} hasErrors boolean indicating is the input has errors or not
 * @param {*} isReset If the form is cleared by the user, all classes and messages are removed
 * @param {*} message Custom error message for an input
 */
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

/**
 * Gets the values of the inputs
 * @returns an object containing the values for number plate and date
 */
const getInputValues = () => {
    const plateNumber = plateNumberInput.value
    const date = circulationDateTimeInput.value
    return { plateNumber, date }
}

/**
 * Checks if an input has valid data for the rest of the program to process
 * @param {*} plate The licence plate number input
 * @param {*} date The date and time input
 * @returns number of errors and an array of the inputs that are erroneous
 */
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

/**
 * Checks the value of the licence plate number input when the blur event is triggered
 */
const checkLNP = () => {
    if (!plateNumberInput.value) {
        setState(plateNumberInput, true, false, 'Licence plate number is required')
    } else if (!/^[A-Z]{2,3}[0-9]{3,4}[A-Z]{0,1}$/.test(plateNumberInput.value))
        setState(plateNumberInput, true, false, 'Incorrect format for licence plate number')
    else
        setState(plateNumberInput, false, false)
}

/**
 * Checks the value of the date and time input when the blur event is triggered
 */
const checkDate = () => {
    if (!circulationDateTimeInput.value)
        setState(circulationDateTimeInput, true, false, 'A date is required')
    else
        setState(circulationDateTimeInput, false, false)
}

/**
 * Depending on the data gathered from the licence plate number 
 * a prediction is built. If a licence plate number is from a province different to Pichincha 'P'
 * it's considered as if the user is willing to visit Quito in the specified date.
 * @param {*} characteristics data obtained from the licence plate number
 * @param {*} date date provided by the user in string format
 * @returns a prediction based on the provided data
 */
const getPrediction = (characteristics, date) => {

    const vhType = `Vehicle type: ${characteristics.type === 'c' ? 'Car' : 'Motorbike'}`
    const province = `${characteristics.province === 'P' ? 'From' : 'Visiting'}: Pichincha`
    const canBeOnRoad = isAbleToRide(characteristics.lastDigit, date) ? 'You are able to use your vehicle' : 'You are not able to use your vehicle'
    return `${vhType} <br/> ${province} <br/> ${canBeOnRoad}`

}

/**
 * Checks if the user can ride through the city in the specified date time.
 * The last digit of the licence number plate, date and time are used to determine that possibility.
 * For cars the last digit is the last number, as for motorbikes it's the last number before the last letter on the
 * licence number plate PI234R -> last digit is 4
 * 
 * For this exercise the last PyP schedule is taken into consideration, which means there are two schedules:
 * from 7am to 9:30am and from 4pm to 7:30pm.
 * 
 * The hours are on 24h format.
 * @param {*} lastDigit 
 * @param {*} date 
 * @returns 
 */
const isAbleToRide = (lastDigit, date) => {
    const dateTime = new Date(date)
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

/**
 * As licence plate numbers are different for cars and motorbikes
 * it's necessary to know the type of vehicle the licence plate is related to.
 * Through some investigation it's determined that cars have a pattern like: AAA0000, that means
 * three letters and four numbers. As for motorbikes, the licence plate number starts with two letters, 
 * followed by three numbers and a lastly one more letter, resulting in something like: AA000A.
 * 
 * Knowing this, two regex strings where used to determine the type of vehicle, province in which it's registered and
 * the last digit.
 * @param {*} plate licence plate number
 * @returns 
 */
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

/**
 * Prints the prediction to a HTML div
 * @param {*} prediction 
 */
const showPrediction = (prediction) => {
    results.classList.add('grow')
    results.innerHTML = prediction
}

/**
 * Cleans the classes indicating errors on the inputs and the prediction
 * @param {*} newSearch if is a new search triggered by the clean button
 */
const reset = (newSearch = true) => {
    const results = document.getElementById('results')
    results.classList.remove('grow')
    results.innerHTML = ''
    setState(plateNumberInput, false, !newSearch)
    setState(circulationDateTimeInput, false, !newSearch)
}

module.exports.default = { extractCharacteristics, inputHasErrors, isAbleToRide }