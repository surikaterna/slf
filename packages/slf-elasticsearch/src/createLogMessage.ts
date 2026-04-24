import { format } from 'date-fns';

const numberFormatter = (payload: any) => {
  if (payload instanceof Date) {
    return payload.getTime();
  }
  return String(payload);
};

const formatters = {
  s: (payload: any) => {
    if (payload instanceof Date) {
      return format(payload, 'yyyy-MM-dd HH:mm:ss');
    }
    return String(payload);
  },
  n: numberFormatter,
  j: (obj: any) => JSON.stringify(obj),
  e: (err: Error) => err.message,
  o: (obj: any) => JSON.stringify(obj),
  d: numberFormatter
};

export function createLogMessage(params: any[]) {
  if (typeof params[0] === 'string') {
    const template = params[0];
    const args = params.slice(1); // Get arguments after the template string
    const regex = /%([snjeod])/g;

    let argIndex = 0;

    return template.replace(regex, (_, specifier) => {
      if (argIndex >= args.length) {
        throw new Error('Insufficient arguments provided for formatting');
      }

      const formatter = formatters[specifier as keyof typeof formatters] as (arg: unknown) => string;
      if (!formatter) {
        return String(specifier);
      }

      return formatter(args[argIndex++] as unknown);
    });
  }
  return params.join(' '); // Fallback for when the first parameter isn't a string
}
