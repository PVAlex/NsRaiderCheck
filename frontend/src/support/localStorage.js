const filterKey = 'filter';

export const getFilter = (tableName) => {
  const filter = JSON.parse(localStorage.getItem(filterKey) || '{}');
  return tableName ? filter[tableName] || {} : filter;
};

export const saveFilter = (tableName, filter) => {
  const value = JSON.stringify({ ...getFilter(), [tableName]: { ...filter, name: undefined } });
  localStorage.setItem(filterKey, value);
};
