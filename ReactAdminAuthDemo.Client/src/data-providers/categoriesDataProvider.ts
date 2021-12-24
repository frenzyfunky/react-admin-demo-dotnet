import axios from 'axios';
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

export type Category = {
   id: Identifier;
   categoryName: string
};

const config: DataProvider = {
   getList: async (
      resource: string,
   ): Promise<GetListResult<any>> => {
      const url = `${apiUrl}/${resource}`;
      const response = await axios.get<Category[]>(url);
      
      var result: GetListResult<Record> = {
         data: response.data,
         total: response.data.length
      };
      
      return result;
   },
   getOne: async (
      resource: string,
      params: GetOneParams
   ): Promise<GetOneResult<any>> => {
      const url = `${apiUrl}/${resource}/${params.id}`;
      const response = await axios.get<Category>(url);

      return {
          data: response.data
      }
   },
   getMany: async (
      resource: string,
      params: GetManyParams
   ): Promise<GetManyResult<any>> => {
      console.log(params);
      
      const url = `${apiUrl}/${resource}`;
      const response = await axios.get<Category[]>(url);
      var result: GetListResult<Record> = {
         data: response.data,
         total: response.data.length
      };

      return result;
   },
   getManyReference: <RecordType extends Record = Record>(
      resource: string,
      params: GetManyReferenceParams
   ): Promise<GetManyReferenceResult<RecordType>> => {
      throw new Error('Function not implemented.');
   },
   update: <RecordType extends Record = Record>(
      resource: string,
      params: UpdateParams<any>
   ): Promise<UpdateResult<RecordType>> => {
      throw new Error('Function not implemented.');
   },
   updateMany: (
      resource: string,
      params: UpdateManyParams<any>
   ): Promise<UpdateManyResult> => {
      throw new Error('Function not implemented.');
   },
   create: <RecordType extends Record = Record>(
      resource: string,
      params: CreateParams<any>
   ): Promise<CreateResult<RecordType>> => {
      throw new Error('Function not implemented.');
   },
   delete: <RecordType extends Record = Record>(
      resource: string,
      params: DeleteParams
   ): Promise<DeleteResult<RecordType>> => {
      throw new Error('Function not implemented.');
   },
   deleteMany: (
      resource: string,
      params: DeleteManyParams
   ): Promise<DeleteManyResult> => {
      throw new Error('Function not implemented.');
   },
};

export default config;
