import { AuthProvider } from 'react-admin';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Claims } from '../claims';

interface LoginResponse {
   token: string;
   refreshToken: string;
   expiration: Date;
}

interface Response {
   message: string;
   status: 'Expired' | 'Error' | 'Success';
}

interface Identity {
   [Claims.EMAIL]: string;
   [Claims.GIVEN_NAME]: string;
   [Claims.NAME]: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

const exchangeRefreshToken = async (auth: LoginResponse) => {
   const url = `${apiUrl}/authenticate/refresh`;

   try {
      const response = await axios.post<LoginResponse>(url, {
         accessToken: auth.token,
         refreshToken: auth.refreshToken,
      });
      localStorage.setItem('auth', JSON.stringify(response.data));
      return Promise.resolve();
   } catch (error) {
      if (axios.isAxiosError(error)) {
         if (error.response?.status.toString().startsWith('4')) {
            return Promise.reject('Please log in again');
         }
      }
   }
};

export const jwtAuthProvider: AuthProvider = {
   login: async function (params: {
      username: string;
      password: string;
   }): Promise<any> {
      const url = `${apiUrl}/authenticate/login`;
      try {
         const response = await axios.post<LoginResponse>(
            url,
            {
               username: params.username,
               password: params.password,
            },
            {
               headers: {
                  'Content-Type': 'application/json',
               },
            }
         );
         var data = response.data;
         localStorage.setItem('auth', JSON.stringify(data));
      } catch (error: any) {
         if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
               return Promise.reject('Wrong credentials');
            }
         }

         return Promise.reject('Error occured');
      }
   },
   logout: function (params: any): Promise<string | false | void> {
      localStorage.removeItem('auth');
      return Promise.resolve();
   },
   checkAuth: async function (params: any): Promise<void> {
      const auth = localStorage.getItem('auth');
      if (auth) {
         const authObj = JSON.parse(auth) as LoginResponse;
         const accessToken = authObj.token;

         // console.log(jwt_decode<Claims>(accessToken));

         const url = `${apiUrl}/authenticate/validate`;
         const response = await axios.post<Response>(
            url,
            { accessToken },
            {
               headers: {
                  'Content-Type': 'application/json',
               },
               validateStatus: (status) => {
                  return status >= 200 && status < 500;
               },
            }
         );
         switch (response.data.status) {
            case 'Success':
               return Promise.resolve();
            case 'Error':
               localStorage.removeItem('auth');
               return Promise.reject('Please log in again');
            case 'Expired':
               return exchangeRefreshToken(authObj);
            default:
               break;
         }
      }

      return Promise.reject();
   },
   checkError: function (error: any): Promise<void> {
      throw new Error('Function not implemented.');
   },
   getPermissions: function (params: any): Promise<any> {
      return Promise.resolve();
   },
   getIdentity: () => {
      try {
         const authObj = JSON.parse(
            localStorage.getItem('auth')!
         ) as LoginResponse;
         const decodedToken = jwt_decode<Identity>(authObj.token);
         return Promise.resolve({
            id: decodedToken[Claims.EMAIL],
            fullName: decodedToken[Claims.GIVEN_NAME],
         });
      } catch (error) {
         return Promise.reject(error);
      }
   },
};
