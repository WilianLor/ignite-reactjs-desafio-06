import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchImages = async (
    pageParam: QueryFunctionContext<'images', any>
  ) => {
    const imagesResponse = await api.get('/api/images', {
      params: { after: pageParam.pageParam },
    });

    return imagesResponse;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.data.after || null,
  });

  const formattedData = useMemo(() => {
    return data?.pages.map(page => page.data.data).flat();
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} mt={5}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar Mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
