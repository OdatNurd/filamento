/******************************************************************************/

import { spoolApiResponseSchema, spoolsSchema } from '@schema/spool';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataFetch } from '@utility/dataFetch';
import { queryConfig } from './config';
import { queryKeys } from './keys';

/******************************************************************************/

const fetchSpools = async () => {
  console.log('Fetching all spools...');
  return dataFetch('/api/v1/spools', {
    schema: spoolsSchema,
    fakeResult: '/data/canned/spools.json',
  });
};

export const useSpools = () => {
  return useQuery({
    queryKey: queryKeys.spools,
    queryFn: fetchSpools,
    staleTime: queryConfig.staleTime,
  });
};

export const useUpdateSpoolLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ spool, locationId }) => {
      console.log(`useUpdateSpoolLocation: Mutating spool ${spool.id} to location ${locationId}`);
      const updatedSpoolData = { ...spool, locationId };
      return dataFetch(`/api/v1/spools/location/${spool.id}`, {
        method: 'POST',
        body: JSON.stringify({ locationId }),
        headers: { 'Content-Type': 'application/json' },
        fakeResult: {
          success: true,
          message: 'Spool location updated successfully.',
          data: updatedSpoolData,
        },
        schema: spoolApiResponseSchema,
      });
    },
    onMutate: async ({ spool, locationId }) => {
      console.log(
        `useUpdateSpoolLocation: Optimistically updating spool ${spool.id} to location ${locationId}`,
      );
      await queryClient.cancelQueries({ queryKey: queryKeys.spools });
      const previousSpools = queryClient.getQueryData(queryKeys.spools);
      queryClient.setQueryData(queryKeys.spools, old =>
        old.map(s => (s.id === spool.id ? { ...s, locationId } : s)),
      );
      return { previousSpools };
    },
    onError: (err, variables, context) => {
      console.error('useUpdateSpoolLocation: Error updating spool, rolling back:', err);
      queryClient.setQueryData(queryKeys.spools, context.previousSpools);
    },
    onSettled: () => {
      if (__CANNED_REQUESTS__ !== 'true') {
        queryClient.invalidateQueries({ queryKey: queryKeys.spools });
      }
    },
  });
};

export const useUpdateSpoolFilament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ spool, newWeight }) => {
      console.log(`useUpdateSpoolFilament: Mutating spool ${spool.id} to weight ${newWeight}`);
      const updatedSpoolData = { ...spool, currentWeight: newWeight };
      return dataFetch(`/api/v1/spools/filament/${spool.id}`, {
        method: 'POST',
        body: JSON.stringify({ currentWeight: newWeight }),
        headers: {
          'Content-Type': 'application/json',
        },
        fakeResult: {
          success: true,
          message: 'Filament weight updated successfully.',
          data: updatedSpoolData,
        },
        schema: spoolApiResponseSchema,
      });
    },
    onMutate: async ({ spool, newWeight }) => {
      console.log(`useUpdateSpoolFilament: Optimistically updating spool ${spool.id} to weight ${newWeight}`);
      await queryClient.cancelQueries({ queryKey: queryKeys.spools });
      const previousSpools = queryClient.getQueryData(queryKeys.spools);

      queryClient.setQueryData(queryKeys.spools, old =>
        old.map(s => (s.id === spool.id ? { ...s, currentWeight: newWeight } : s)),
      );

      return { previousSpools };
    },
    onError: (err, variables, context) => {
      console.error('useUpdateSpoolFilament: Error updating spool, rolling back:', err);
      queryClient.setQueryData(queryKeys.spools, context.previousSpools);
    },
    onSettled: () => {
      if (__CANNED_REQUESTS__ !== 'true') {
        queryClient.invalidateQueries({ queryKey: queryKeys.spools });
      }
    },
  });
};

/******************************************************************************/
