import { type GetServerSideProps } from 'next';

const Home = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (_context) => {
  return {
    redirect: {
      destination: '/play',
      permanent: false,
    },
  };
};

export default Home;