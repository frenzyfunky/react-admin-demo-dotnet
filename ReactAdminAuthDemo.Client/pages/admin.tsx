import { NextPage } from 'next';
import dynamic from 'next/dynamic';

const NoSsrReactAdmin = dynamic(() => import('../src/components/ReactAdmin'), {
   ssr: false,
});

const Admin: NextPage = () => {
   return (
      <>
         <NoSsrReactAdmin />
      </>
   );
};

export default Admin;
