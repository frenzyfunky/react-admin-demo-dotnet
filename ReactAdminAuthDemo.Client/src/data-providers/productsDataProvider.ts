import axios, { AxiosResponse } from 'axios';
import { stringify } from 'query-string';

import {
   CreateParams,
   CreateResult,
   DataProvider,
   DeleteManyParams,
   DeleteManyResult,
   DeleteParams,
   DeleteResult,
   GetListParams,
   GetListResult,
   GetManyParams,
   GetManyReferenceParams,
   GetManyReferenceResult,
   GetManyResult,
   GetOneParams,
   GetOneResult,
   UpdateManyParams,
   UpdateManyResult,
   UpdateParams,
   UpdateResult,
   Record,
   Identifier,
} from 'react-admin';

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export type Product = {
   id: Identifier;
   title: string;
   price: number;
   description: string;
   categoryName: string;
   image: string;
   rating: {
      rate: number;
      count: number;
   };
};

const config: DataProvider = {
   getList: async (
      resource: string,
      params: GetListParams
   ): Promise<GetListResult<any>> => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
         sort: JSON.stringify([field, order]),
         range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
         filter: JSON.stringify(params.filter),
      };

      const url = `${apiUrl}/${resource}?${stringify(query)}`;
      const response = await axios.get<Product[]>(url);
      var result: GetListResult<Record> = {
         data: response.data,
         total: parseInt(
            response.headers['content-range'].split('/').pop() as string,
            10
         ),
      };

      return result;
   },
   getOne: async (
      resource: string,
      params: GetOneParams
   ): Promise<GetOneResult<any>> => {
      const url = `${apiUrl}/${resource}/${params.id}`;
      const response = await axios.get<Product>(url);

      return {
         data: response.data,
      };
   },
   getMany: <RecordType extends Record = Record>(
      resource: string,
      params: GetManyParams
   ): Promise<GetManyResult<RecordType>> => {
      throw new Error('Function not implemented.');
   },
   getManyReference: <RecordType extends Record = Record>(
      resource: string,
      params: GetManyReferenceParams
   ): Promise<GetManyReferenceResult<RecordType>> => {
      throw new Error('Function not implemented.');
   },
   update: async (
      resource: string,
      params: UpdateParams<Product>
   ): Promise<UpdateResult<any>> => {
      const url = `${apiUrl}/${resource}/${params.id}`;
      const response = await axios.put<Product, any, Product>(url, params.data);

      return {
         data: response.data,
      };
   },
   updateMany: (
      resource: string,
      params: UpdateManyParams<any>
   ): Promise<UpdateManyResult> => {
      throw new Error('Function not implemented.');
   },
   create: async (
      resource: string,
      params: CreateParams<Product>
   ): Promise<CreateResult<any>> => {
      const url = `${apiUrl}/${resource}`;
      const response = await axios.post<Product, AxiosResponse<Product>, Product>(
         url,
         params.data
      );

      return {
         data: response.data,
      };
   },
   delete: async (
      resource: string,
      params: DeleteParams
   ): Promise<DeleteResult<any>> => {
      const url = `${apiUrl}/${resource}/${params.id}`;
      const response = await axios.delete<Product>(url);

      return {
         data: response.data,
      };
   },
   deleteMany: (
      resource: string,
      params: DeleteManyParams
   ): Promise<DeleteManyResult> => {
      throw new Error('Function not implemented.');
   },
};

export default config;
