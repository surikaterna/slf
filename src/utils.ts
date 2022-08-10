type StrictCapitalize<T extends string> = Capitalize<Lowercase<T>>;

export const capitalize = <T extends string>(str: T): StrictCapitalize<T> => {
  return (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()) as StrictCapitalize<T>;
};
