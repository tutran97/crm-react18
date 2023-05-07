import { omitBy } from 'lodash';

export const cleanParams = (params) => omitBy(params, (v) => v === '' || v === null);
