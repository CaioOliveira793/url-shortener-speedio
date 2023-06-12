export function makeObjectPath(items: Array<string | number>): string {
	let path = '';
	for (const item of items) {
		if (typeof item === 'number') path += '[' + item + ']';
		else path += '.' + item;
	}
	return path;
}
