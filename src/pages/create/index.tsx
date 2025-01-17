import dynamic from 'next/dynamic';

const Index = dynamic(() => import('./TuneBuilder'), {
    ssr: false,
});

export default Index;