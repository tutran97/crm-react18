import fromPairs from 'lodash/fromPairs';

export const buildFilter = (searchParams, filters = []) => {
  const filterVariables = {};
  for (const [paramKey, paramValue] of searchParams.entries()) {
    if (
      filters.find((filter) => {
        if (filter.type === 'DateRange') {
          return (
            `start${filter?.options?.param}` === paramKey ||
            `end${filter?.options?.param}` === paramKey
          );
        }
        return filter?.options?.param === paramKey;
      })
    ) {
      filterVariables[paramKey] = paramValue;
    }
  }

  const sort = searchParams.get('sort');
  const limit = parseInt(searchParams.get('limit')) || null;
  const offset = parseInt(searchParams.get('offset')) || null;

  return {
    limit,
    offset,
    sort: sort ? fromPairs([sort.split('-', 2)]) : null,
    filter: filterVariables
  };
};
