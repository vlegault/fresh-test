export function isString(value) {
	return typeof value === 'string' || value instanceof String;
}

export function isTimeFormatValid(value) {
	const timeRegEx = /^(2[0-3]|[01]?\d):([0-5]?\d):([0-5]?\d)$/;
	return isString(value) && timeRegEx.test(value);
}
