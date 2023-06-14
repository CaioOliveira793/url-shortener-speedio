import type { InputTransform, InputData } from 'vue-typed-form';

export const DateTimeInputTransform: InputTransform<InputData, Date | null> = {
	parse: parseDatetimeFromInputEvent,
	display: (date: Date | null): string => {
		return date ? date.toISOString() : '';
	},
};

function parseDatetimeFromInputEvent(ev: InputEvent) {
	const target = ev.target;
	if (
		target instanceof HTMLInputElement &&
		isHTMLInputElementDateTimeType(target)
	) {
		return target.valueAsDate;
	}
	return null;
}

function isHTMLInputElementDateTimeType(input: HTMLInputElement): boolean {
	return input.type === 'datetime' || input.type === 'datetime-local';
}
