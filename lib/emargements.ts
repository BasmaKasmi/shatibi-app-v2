/** @ref https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_groupby */

export const groupEmargementsByDate = (
  allEmargementsFlattened: any
): Record<string, Array<any>> => {
  return allEmargementsFlattened.reduce((accumulateur: any, value: any) => {
    const date = value.date;

    accumulateur[date] = accumulateur[date]
      ? [value, ...accumulateur[date]]
      : [value];

    return accumulateur;
  }, {});
};
