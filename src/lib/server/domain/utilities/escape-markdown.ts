export function escapeMarkdownUtility(text: string): string {
	const markdownCharacters = [
		'_',
		'*',
		'[',
		']',
		'(',
		')',
		'~',
		'`',
		'>',
		'#',
		'+',
		'-',
		'=',
		'|',
		'{',
		'}',
		'.',
		'!'
	];
	let escapedText = text;

	for (const char of markdownCharacters) {
		const regex = new RegExp(`\\${char}`, 'g');
		escapedText = escapedText.replace(regex, `\\${char}`);
	}

	return escapedText;
}
