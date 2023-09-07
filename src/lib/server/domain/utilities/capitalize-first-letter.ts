export function capitalizeFirstLetterUtility(inputString: string): string {
	const firstLetter = inputString.charAt(0).toUpperCase();
	const restOfString = inputString.slice(1).toLowerCase();
	return firstLetter + restOfString;
}
