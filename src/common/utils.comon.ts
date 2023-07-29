/* eslint-disable prettier/prettier */
export const isNullOrUndefined = (object) => {
    if (object === null || object === undefined || object === '') {
        return true;
    } else {
        return false;
    }
};