/******************************************************************************/

import { Page } from '@components/layout/Page';
import { DragDropContext } from '@hello-pangea/dnd';
import { InventoryLocation } from '@inventory/InventoryLocation';
import { InventorySidebar } from '@inventory/InventorySidebar';
import {
  IonAlert,
  IonButton,
  IonCol,
  IonFab,
  IonFabButton,
  IonFabList,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonToggle,
} from '@ionic/react';
import { DeleteLocationModal } from '@modals/DeleteLocationModal';
import { FilterModal } from '@modals/FilterModal';
import { LocationModal } from '@modals/LocationModal';
import { SpoolDetailModal } from '@modals/SpoolDetailModal';
import {
  useCreateInventoryLocation,
  useDeleteInventoryLocation,
  useInventoryLocations,
  useUpdateInventoryLocation,
} from '@query/inventory';
import { useSpools, useUpdateSpoolFilament, useUpdateSpoolLocation } from '@query/spool';
import { loadState, saveState } from '@utility/storage';
import { add, createOutline, filter, trash } from 'ionicons/icons';
import { useEffect, useMemo, useState } from 'react';

/******************************************************************************/

const SHOW_EMPTY_STORAGE_KEY = 'inventory_show_empty';
const TOGGLED_LOCATIONS_KEY = 'inventory_toggled_locations';
const LOCATION_ORDER_KEY = 'inventory_location_order';
const NOT_IN_STORAGE_ID = 'not-in-storage';

export const Inventory = () => {
  const { data: locations, isLoading: locationsLoading, refetch: refetchLocations } = useInventoryLocations();
  const { data: spools, isLoading: spoolsLoading, refetch: refetchSpools } = useSpools();

  const { mutate: createLocation } = useCreateInventoryLocation();
  const { mutate: updateLocation } = useUpdateInventoryLocation();
  const { mutate: deleteLocation } = useDeleteInventoryLocation();
  const { mutate: updateSpoolLocation } = useUpdateSpoolLocation();
  const { mutate: updateSpoolFilament } = useUpdateSpoolFilament();

  // Most state is now handled by tanstack-query, but we still need local
  // state for UI specific things that should not be globally persisted.
  const [showEmpty, setShowEmpty] = useState(() => loadState(SHOW_EMPTY_STORAGE_KEY, true));
  const [toggledLocations, setToggledLocations] = useState(() => {
    const saved = loadState(TOGGLED_LOCATIONS_KEY, '');
    if (saved === '') return new Set();
    return new Set(saved.split(','));
  });
  const [locationOrder, setLocationOrder] = useState([]);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSpool, setSelectedSpool] = useState(null);
  const [locationModalMode, setLocationModalMode] = useState('add');
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [locationsToDelete, setLocationsToDelete] = useState([]);
  const [locationToEdit, setLocationToEdit] = useState(null);
  const [filters, setFilters] = useState({ brand: [], material: [], color: [] });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (locations) {
      setLocationOrder(() => {
        const rawSavedOrder = loadState(LOCATION_ORDER_KEY, []);
        let savedOrder;

        if (typeof rawSavedOrder === 'string' && rawSavedOrder.length > 0) {
          savedOrder = rawSavedOrder.split(',');
        } else if (Array.isArray(rawSavedOrder)) {
          savedOrder = rawSavedOrder;
        } else {
          savedOrder = [];
        }

        const locationIds = locations.map(l => l.id);
        if (savedOrder.length === 0) return locationIds;

        const savedKeySet = new Set(savedOrder);
        const validKeys = savedOrder.filter(key => locationIds.includes(key));
        const newKeys = locationIds.filter(key => !savedKeySet.has(key));

        return [...validKeys, ...newKeys];
      });
    }
  }, [locations]);

  const { filterOptions, totalSpoolCount } = useMemo(() => {
    if (!spools) return { filterOptions: { brands: [], materials: [], colors: [] }, totalSpoolCount: 0 };
    const brands = [...new Set(spools.map(item => item.vendor))].sort();
    const materials = [...new Set(spools.map(item => item.material))].sort();
    const colors = [...new Set(spools.map(item => item.colorName))].sort();
    return {
      filterOptions: { brands, materials, colors },
      totalSpoolCount: spools.length,
    };
  }, [spools]);

  const isFilterActive = useMemo(
    () => filters.brand.length > 0 || filters.material.length > 0 || filters.color.length > 0,
    [filters],
  );

  useEffect(() => {
    saveState(SHOW_EMPTY_STORAGE_KEY, showEmpty);
  }, [showEmpty]);

  useEffect(() => {
    if (locations) {
      saveState(TOGGLED_LOCATIONS_KEY, Array.from(toggledLocations).join(','));
    }
  }, [toggledLocations, locations]);

  useEffect(() => {
    if (locationOrder.length > 0) {
      saveState(LOCATION_ORDER_KEY, locationOrder);
    }
  }, [locationOrder]);

  const fullInventoryMap = useMemo(() => {
    if (!locations || !spools) return {};

    const inventoryMap = locations.reduce((acc, loc) => {
      acc[loc.id] = { ...loc, items: [], totalItemCount: 0 };
      return acc;
    }, {});

    inventoryMap[NOT_IN_STORAGE_ID] = {
      id: NOT_IN_STORAGE_ID,
      name: 'Not in Storage',
      description: 'Spools not assigned to a location',
      items: [],
      totalItemCount: 0,
    };

    spools.forEach(spool => {
      const locationId = spool.locationId || NOT_IN_STORAGE_ID;
      if (inventoryMap[locationId]) {
        inventoryMap[locationId].items.push(spool);
      }
    });

    for (const locationId in inventoryMap) {
      inventoryMap[locationId].totalItemCount = inventoryMap[locationId].items.length;
    }

    return inventoryMap;
  }, [locations, spools]);

  useEffect(() => {
    if (toggledLocations.has(NOT_IN_STORAGE_ID) && !fullInventoryMap[NOT_IN_STORAGE_ID]) {
      setToggledLocations(prev => {
        const newSet = new Set(prev);
        newSet.delete(NOT_IN_STORAGE_ID);
        return newSet;
      });
    }
  }, [toggledLocations, fullInventoryMap]);

  const displayedInventory = useMemo(() => {
    let inventoryToShow = { ...fullInventoryMap };

    if (toggledLocations.size > 0) {
      const toggledInventory = {};
      toggledLocations.forEach(id => {
        if (inventoryToShow[id]) {
          toggledInventory[id] = inventoryToShow[id];
        }
      });
      inventoryToShow = toggledInventory;
    }

    const finalInventory = {};
    for (const locationId in inventoryToShow) {
      const location = { ...inventoryToShow[locationId] };
      let items = location.items;

      if (isFilterActive) {
        items = items.filter(item => {
          const brandMatch = filters.brand.length === 0 || filters.brand.includes(item.vendor);
          const materialMatch = filters.material.length === 0 || filters.material.includes(item.material);
          const colorMatch = filters.color.length === 0 || filters.color.includes(item.colorName);
          return brandMatch && materialMatch && colorMatch;
        });
      }

      if (!showEmpty) {
        items = items.filter(item => item.currentWeight > 0);
      }
      finalInventory[locationId] = { ...location, items };
    }

    return finalInventory;
  }, [fullInventoryMap, toggledLocations, showEmpty, filters, isFilterActive]);

  const handleLocationToggle = locationId => {
    setToggledLocations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(locationId)) newSet.delete(locationId);
      else newSet.add(locationId);
      return newSet;
    });
  };

  const handleSpoolClick = spool => {
    setSelectedSpool(spool);
    setDetailModalOpen(true);
  };

  const handleSetSpoolLocation = locationId => {
    if (!selectedSpool) return;
    updateSpoolLocation(
      { spool: selectedSpool, locationId },
      {
        onSuccess: updatedSpool => setSelectedSpool(updatedSpool),
      },
    );
  };

  const handleClearSpoolLocation = () => {
    if (!selectedSpool) return;
    updateSpoolLocation(
      { spool: selectedSpool, locationId: undefined },
      {
        onSuccess: updatedSpool => setSelectedSpool(updatedSpool),
      },
    );
  };

  const handleUpdateSpoolWeight = newWeight => {
    if (!selectedSpool) return;
    updateSpoolFilament(
      { spool: selectedSpool, newWeight },
      {
        onSuccess: updatedSpool => {
          setSelectedSpool(updatedSpool);
        },
      },
    );
  };

  const handleSaveLocation = locationData => {
    const isEditing = locations.some(loc => loc.id === locationData.id);
    if (isEditing) {
      updateLocation(locationData);
    } else {
      createLocation(locationData, {
        onSuccess: () => {
          setLocationOrder([...locationOrder, locationData.id]);
        },
      });
    }
    setLocationToEdit(null);
  };

  const triggerDeleteConfirmation = () => {
    if (locationsToDelete.length === 0) return;
    setDeleteModalOpen(false);
    setShowDeleteConfirm(true);
  };

  const handleDeleteLocations = () => {
    deleteLocation(locationsToDelete, {
      onSuccess: () => {
        const toDeleteSet = new Set(locationsToDelete);
        setLocationOrder(prev => prev.filter(id => !toDeleteSet.has(id)));
        setToggledLocations(prev => {
          const newToggled = new Set(prev);
          locationsToDelete.forEach(id => newToggled.delete(id));
          return newToggled;
        });
        setLocationsToDelete([]);
      },
    });
  };

  const handleCheckboxChange = (id, isChecked) => {
    setLocationsToDelete(prev => (isChecked ? [...prev, id] : prev.filter(locId => locId !== id)));
  };

  const handleFilterChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));
  const resetFilters = () => {
    setFilters({ brand: [], material: [], color: [] });
    setFilterModalOpen(false);
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = result => {
    setIsDragging(false);
    const { source, destination, type, draggableId } = result;
    if (!destination) return;
    if (type === 'location') {
      const newOrder = Array.from(locationOrder);
      const [reorderedItem] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, reorderedItem);
      setLocationOrder(newOrder);
      return;
    }
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const spoolToUpdate = spools.find(s => s.id === draggableId);
    if (!spoolToUpdate) return;

    const locationId = destination.droppableId === NOT_IN_STORAGE_ID ? undefined : destination.droppableId;
    updateSpoolLocation({ spool: spoolToUpdate, locationId });
  };

  const handleRefresh = async event => {
    await Promise.all([refetchLocations(), refetchSpools()]);
    event.detail.complete();
  };

  if (locationsLoading || spoolsLoading) return <Page title="Inventory">Loading...</Page>;
  if (!locations || !spools) return <Page title="Inventory">Error loading inventory.</Page>;

  const pageTitle = (
    <>
      Inventory
      <span style={{ fontSize: '0.8em', color: 'var(--ion-color-medium)', marginLeft: '8px' }}>
        ({totalSpoolCount} {totalSpoolCount === 1 ? 'spool' : 'spools'}){isFilterActive && ' [Filter Active]'}
      </span>
    </>
  );

  const openAddModal = () => {
    setLocationModalMode('add');
    setLocationToEdit(null);
    setShowLocationSelector(false);
    setLocationModalOpen(true);
  };

  const openEditModalWithSelector = () => {
    setLocationModalMode('edit');
    setLocationToEdit(null);
    setShowLocationSelector(true);
    setLocationModalOpen(true);
  };

  const openEditModalForId = id => {
    setLocationModalMode('edit');
    setLocationToEdit(id);
    setShowLocationSelector(false);
    setLocationModalOpen(true);
  };

  return (
    <Page
      title={pageTitle}
      headerButton={
        <IonButton onClick={() => setFilterModalOpen(true)} color={isFilterActive ? 'primary' : 'dark'}>
          <IonIcon slot="icon-only" icon={filter} />
        </IonButton>
      }
    >
      <IonLoading isOpen={locationsLoading || spoolsLoading} message="Refreshing..." />
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh} disabled={isDragging}>
        <IonRefresherContent />
      </IonRefresher>
      <div className="inventory-page-layout">
        <div className="inventory-controls">
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonCol size="auto">
                <IonItem lines="none">
                  <IonToggle checked={showEmpty} onIonChange={e => setShowEmpty(e.detail.checked)}>
                    <IonLabel>Show Empty Spools</IonLabel>
                  </IonToggle>
                </IonItem>
              </IonCol>
              <IonCol />
            </IonRow>
          </IonGrid>
        </div>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="inventory-dnd-container">
            <div className="inventory-container">
              {locationOrder
                .map(id => displayedInventory[id])
                .filter(Boolean)
                .map(loc => (
                  <InventoryLocation
                    key={loc.id}
                    {...loc}
                    isFilterActive={isFilterActive}
                    onSpoolClick={handleSpoolClick}
                  />
                ))}
              {displayedInventory[NOT_IN_STORAGE_ID] && (
                <InventoryLocation
                  key={NOT_IN_STORAGE_ID}
                  {...displayedInventory[NOT_IN_STORAGE_ID]}
                  isFilterActive={isFilterActive}
                  onSpoolClick={handleSpoolClick}
                />
              )}
            </div>
            <div className="sidebar-container">
              <InventorySidebar
                locations={fullInventoryMap}
                locationOrder={locationOrder}
                toggledLocations={toggledLocations}
                onToggleLocation={handleLocationToggle}
                onLongPressLocation={openEditModalForId}
              />
            </div>
          </div>
        </DragDropContext>
      </div>

      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonIcon icon={add} />
        </IonFabButton>
        <IonFabList side="top">
          <IonFabButton onClick={openEditModalWithSelector}>
            <IonIcon icon={createOutline} />
          </IonFabButton>
          <IonFabButton onClick={() => setDeleteModalOpen(true)}>
            <IonIcon icon={trash} />
          </IonFabButton>
          <IonFabButton onClick={openAddModal}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFabList>
      </IonFab>

      <SpoolDetailModal
        spool={selectedSpool}
        isOpen={isDetailModalOpen}
        onDidDismiss={() => setDetailModalOpen(false)}
        locations={locations}
        onSetLocation={handleSetSpoolLocation}
        onClearLocation={handleClearSpoolLocation}
        onUpdateWeight={handleUpdateSpoolWeight}
      />
      <FilterModal
        isOpen={isFilterModalOpen}
        onDidDismiss={() => setFilterModalOpen(false)}
        filterOptions={filterOptions}
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        showEmpty={showEmpty}
        setShowEmpty={setShowEmpty}
      />
      <LocationModal
        isOpen={isLocationModalOpen}
        onDidDismiss={() => setLocationModalOpen(false)}
        mode={locationModalMode}
        showSelector={showLocationSelector}
        locationToEdit={locationToEdit}
        setLocationToEdit={setLocationToEdit}
        handleSave={handleSaveLocation}
        locationsState={locations}
      />
      <DeleteLocationModal
        isOpen={isDeleteModalOpen}
        onDidDismiss={() => setDeleteModalOpen(false)}
        locationsState={locations}
        locationsToDelete={locationsToDelete}
        handleCheckboxChange={handleCheckboxChange}
        handleDeleteLocations={triggerDeleteConfirmation}
      />
      <IonAlert
        isOpen={showDeleteConfirm}
        onDidDismiss={() => setShowDeleteConfirm(false)}
        header={'Confirm Deletion'}
        message={`This will remove ${locationsToDelete.length} location(s) and move all spools within them to 'Not in Storage'. This cannot be undone.`}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: handleDeleteLocations,
          },
        ]}
      />
    </Page>
  );
};

/******************************************************************************/
