export default function toDateISOString(input: Date | string): string {
  if (input instanceof Date) {
    return input.toISOString();
  } else if (Date.parse(input)) {
    return input;
  } else {
    throw new TypeError(
      'Input is not a Date object or not a valid date-string',
    );
  }
}
