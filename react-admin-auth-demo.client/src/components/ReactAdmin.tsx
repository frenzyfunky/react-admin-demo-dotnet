import { Admin, Resource } from 'react-admin';
import { jwtAuthProvider } from '../auth-providers/jwtAuthProvider';
import compositeProviders from '../data-providers/compositeProviders';
import { CustomLoginPage } from './admin-components/CustomLoginPage';
import { ProductList, EditProduct, CreateProduct } from './admin-components/Products';

const ReactAdmin: React.FC = () => {
   return (
      <Admin dataProvider={compositeProviders} authProvider={jwtAuthProvider} loginPage={CustomLoginPage}>
         <Resource name='products' list={ProductList} edit={EditProduct} create={CreateProduct} />
      </Admin>
   );
};

export default ReactAdmin;
