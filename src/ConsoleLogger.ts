import { Event } from './LoggerFactory';

/**
 * Implementation of a tiny logging provider using the console.log
 */
const factory = (event: Event) => console.log(event.name, JSON.stringify(event, null, 2));
export { factory as ConsoleLogger };
