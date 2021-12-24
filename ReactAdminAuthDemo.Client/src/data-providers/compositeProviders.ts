import categoriesProvider from './categoriesDataProvider';
import productsProvider from './productsDataProvider';

import {
   GET_LIST,
   GET_ONE,
   CREATE,
   UPDATE,
   UPDATE_MANY,
   DELETE,
   GET_MANY,
   GET_MANY_REFERENCE,
} from 'react-admin';

const dataProviders = [
   {
      dataProvider: categoriesProvider,
      resources: ['categories'],
   },
   {
      dataProvider: productsProvider,
      resources: ['products'],
   }
];

export default (type: any, resource: any, params: any) => {
   const dataProviderMapping = dataProviders.find((dp) =>
      dp.resources.includes(resource)
   );

   const mappingType: any = {
      [GET_LIST]: 'getList',
      [GET_ONE]: 'getOne',
      [GET_MANY]: 'getMany',
      [GET_MANY_REFERENCE]: 'getManyReference',
      [CREATE]: 'create',
      [UPDATE]: 'update',
      [UPDATE_MANY]: 'updateMany',
      [DELETE]: 'delete',
   };

   return dataProviderMapping!.dataProvider[mappingType[type]](resource, params);
};
