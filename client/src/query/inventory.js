/******************************************************************************/

import { apiObjectResponseSchema } from '@schema/api';
import { inventoryLocationApiResponseSchema, inventoryLocationsSchema } from '@schema/inventory';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataFetch } from '@utility/dataFetch';
import { queryConfig } from './config';
import { queryKeys } from './keys';

/******************************************************************************/

const fetchInventoryLocations = async () => {
  console.log('Fetching all inventory locations...');
  return dataFetch('/api/v1/inventory-locations', {
    schema: inventoryLocationsSchema,
    fakeResult: '/data/canned/inventory.json',
  });
};

export const useInventoryLocations = () => {
  return useQuery({
    queryKey: queryKeys.inventoryLocations,
    queryFn: fetchInventoryLocations,
    staleTime: queryConfig.staleTime,
  });
};

export const useCreateInventoryLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async newLocation => {
      console.log('useCreateInventoryLocation: Creating new location:', newLocation);
      return dataFetch(`/api/v1/inventory-locations`, {
        method: 'POST',
        body: JSON.stringify(newLocation),
        headers: { 'Content-Type': 'application/json' },
        fakeResult: {
          success: true,
          message: 'Location created successfully.',
          data: newLocation,
        },
        schema: inventoryLocationApiResponseSchema,
      });
    },
    onMutate: async newLocation => {
      console.log('useCreateInventoryLocation: Optimistically creating location:', newLocation);
      await queryClient.cancelQueries({ queryKey: queryKeys.inventoryLocations });
      const previousLocations = queryClient.getQueryData(queryKeys.inventoryLocations);
      queryClient.setQueryData(queryKeys.inventoryLocations, old => [...(old || []), newLocation]);
      return { previousLocations };
    },
    onError: (err, newLocation, context) => {
      console.error('useCreateInventoryLocation: Error creating location, rolling back:', err);
      queryClient.setQueryData(queryKeys.inventoryLocations, context.previousLocations);
    },
    onSettled: () => {
      if (__CANNED_REQUESTS__ !== 'true') {
        queryClient.invalidateQueries({ queryKey: queryKeys.inventoryLocations });
      }
    },
  });
};

export const useUpdateInventoryLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async updatedLocation => {
      console.log('useUpdateInventoryLocation: Updating location:', updatedLocation);
      return dataFetch(`/api/v1/inventory-locations/${updatedLocation.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedLocation),
        headers: { 'Content-Type': 'application/json' },
        fakeResult: {
          success: true,
          message: 'Location updated successfully.',
          data: updatedLocation,
        },
        schema: inventoryLocationApiResponseSchema,
      });
    },
    onMutate: async updatedLocation => {
      console.log('useUpdateInventoryLocation: Optimistically updating location:', updatedLocation);
      await queryClient.cancelQueries({ queryKey: queryKeys.inventoryLocations });
      const previousLocations = queryClient.getQueryData(queryKeys.inventoryLocations);
      queryClient.setQueryData(queryKeys.inventoryLocations, old =>
        old.map(loc => (loc.id === updatedLocation.id ? updatedLocation : loc)),
      );
      return { previousLocations };
    },
    onError: (err, updatedLocation, context) => {
      console.error('useUpdateInventoryLocation: Error updating location, rolling back:', err);
      queryClient.setQueryData(queryKeys.inventoryLocations, context.previousLocations);
    },
    onSettled: () => {
      if (__CANNED_REQUESTS__ !== 'true') {
        queryClient.invalidateQueries({ queryKey: queryKeys.inventoryLocations });
      }
    },
  });
};

export const useDeleteInventoryLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async locationIdsToDelete => {
      console.log('useDeleteInventoryLocation: Deleting locations:', locationIdsToDelete);
      return dataFetch(`/api/v1/inventory-locations`, {
        method: 'DELETE',
        body: JSON.stringify({ ids: locationIdsToDelete }),
        headers: { 'Content-Type': 'application/json' },
        fakeResult: {
          success: true,
          message: 'Locations deleted successfully.',
          data: {},
        },
        schema: apiObjectResponseSchema,
      });
    },
    onMutate: async locationIdsToDelete => {
      console.log('useDeleteInventoryLocation: Optimistically deleting locations:', locationIdsToDelete);
      await queryClient.cancelQueries({ queryKey: queryKeys.inventoryLocations });
      await queryClient.cancelQueries({ queryKey: queryKeys.spools });

      const previousLocations = queryClient.getQueryData(queryKeys.inventoryLocations);
      const previousSpools = queryClient.getQueryData(queryKeys.spools);

      const toDeleteSet = new Set(locationIdsToDelete);
      queryClient.setQueryData(queryKeys.inventoryLocations, old =>
        old.filter(loc => !toDeleteSet.has(loc.id)),
      );
      queryClient.setQueryData(queryKeys.spools, old =>
        old.map(spool => {
          if (toDeleteSet.has(spool.locationId)) {
            const newSpool = { ...spool };
            delete newSpool.locationId;
            return newSpool;
          }
          return spool;
        }),
      );
      return { previousLocations, previousSpools };
    },
    onError: (err, newTodo, context) => {
      console.error('useDeleteInventoryLocation: Error deleting locations, rolling back:', err);
      queryClient.setQueryData(queryKeys.inventoryLocations, context.previousLocations);
      queryClient.setQueryData(queryKeys.spools, context.previousSpools);
    },
    onSettled: () => {
      if (__CANNED_REQUESTS__ !== 'true') {
        queryClient.invalidateQueries({ queryKey: queryKeys.inventoryLocations });
        queryClient.invalidateQueries({ queryKey: queryKeys.spools });
      }
    },
  });
};

/******************************************************************************/
