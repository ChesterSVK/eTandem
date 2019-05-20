import {TeachingMotivationEnum} from "./helperData";
import {Meteor} from "meteor/meteor";

/**
 * Negates the motivation for languages
 **********************************************************************************************************************/
export function negateMotivation(motivation) {
    checkMotivation(motivation);
    if (motivation === TeachingMotivationEnum.WTLEARN) {
        return TeachingMotivationEnum.WTTEACH;
    }
    if (motivation === TeachingMotivationEnum.WTTEACH) {
        return TeachingMotivationEnum.WTLEARN;
    }
}

/**
 * Checks if the condition is true, otherwise throws error with provided parameters
 **********************************************************************************************************************/
export function checkCondition(condition, errorTag = 'error', errorMessage = 'Empty error message', errorObject = {}) {
    if (!condition) {
        throw new Meteor.Error(errorTag, errorMessage, errorObject);
    }
}

/**
 * Checks if the motivations is valid
 **********************************************************************************************************************/
export function checkMotivation(motivation, errorObject = {}) {
    checkCondition(
        Object.values(TeachingMotivationEnum).indexOf(motivation) !== -1,
        'error-invalid-motivation',
        'Invalid motivation: ' + motivation,
        errorObject);
}

/**
 * Returns the other parameter from array of length 2, false otherwise
 **********************************************************************************************************************/
export function getOtherOne(array, oneElementFromArray){
    if (!array.length || array.length !== 2 || array.indexOf(oneElementFromArray) === -1) return false;
    return array[0] === oneElementFromArray ? array[1] : array[0];
}