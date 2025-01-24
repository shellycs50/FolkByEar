import dynamic from 'next/dynamic';

const Index = dynamic(() => import('./Player'), {
    ssr: false,
});

export default Index;