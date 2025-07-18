/******************************************************************************/

import { Page } from '@components/layout/Page';
import {
  IonButton,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonList,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { FilterModal } from '@modals/FilterModal';
import { SpoolDetailModal } from '@modals/SpoolDetailModal';
import { useInventoryLocations } from '@query/inventory';
import { useSpools, useUpdateSpoolFilament, useUpdateSpoolLocation } from '@query/spool';
import { SpoolDetailItem } from '@spools/SpoolDetailItem';
import { add, barcodeOutline, filter, keypadOutline, searchOutline } from 'ionicons/icons';
import { useMemo, useState } from 'react';

/******************************************************************************/

export const Spools = () => {
  const { data: spools, isLoading, isError, refetch, isRefetching } = useSpools();
  const { data: locations } = useInventoryLocations();
  const { mutate: updateSpoolLocation } = useUpdateSpoolLocation();
  const { mutate: updateSpoolFilament } = useUpdateSpoolFilament();

  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSpool, setSelectedSpool] = useState(null);
  const [filters, setFilters] = useState({ brand: [], material: [], color: [] });
  const [showEmpty, setShowEmpty] = useState(true);

  const { groupedSpools, filterOptions } = useMemo(() => {
    if (!spools) return { groupedSpools: {}, filterOptions: { brands: [], materials: [], colors: [] } };

    const brands = [...new Set(spools.map(item => item.vendor))].sort();
    const materials = [...new Set(spools.map(item => item.material))].sort();
    const colors = [...new Set(spools.map(item => item.colorName))].sort();

    const spoolsData = spools.reduce((acc, spool) => {
      const key = `${spool.vendor}-${spool.material}-${spool.colorName}`;
      if (!acc[key]) {
        acc[key] = {
          vendor: spool.vendor,
          material: spool.material,
          colorName: spool.colorName,
          spools: [],
        };
      }
      acc[key].spools.push(spool);
      return acc;
    }, {});

    return {
      groupedSpools: spoolsData,
      filterOptions: { brands, materials, colors },
    };
  }, [spools]);

  const isFilterActive = useMemo(
    () => filters.brand.length > 0 || filters.material.length > 0 || filters.color.length > 0 || !showEmpty,
    [filters, showEmpty],
  );

  const displayedSpools = useMemo(() => {
    let filteredGroups = Object.values(groupedSpools);

    if (isFilterActive) {
      filteredGroups = filteredGroups.filter(group => {
        const brandMatch = filters.brand.length === 0 || filters.brand.includes(group.vendor);
        const materialMatch = filters.material.length === 0 || filters.material.includes(group.material);
        const colorMatch = filters.color.length === 0 || filters.color.includes(group.colorName);
        return brandMatch && materialMatch && colorMatch;
      });
    }

    if (!showEmpty) {
      filteredGroups = filteredGroups
        .map(group => {
          const spools = group.spools.filter(spool => spool.currentWeight > 0);
          return { ...group, spools };
        })
        .filter(group => group.spools.length > 0);
    }

    return filteredGroups;
  }, [groupedSpools, filters, isFilterActive, showEmpty]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
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

  const resetFilters = () => {
    setFilters({ brand: [], material: [], color: [] });
    setShowEmpty(true);
    setFilterModalOpen(false);
  };

  const handleRefresh = async event => {
    await refetch();
    event.detail.complete();
  };

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading spools...</p>;
    }

    if (isError) {
      return <p>Error loading spool data.</p>;
    }

    return (
      <IonList>
        {displayedSpools.map(group => (
          <SpoolDetailItem
            key={`${group.vendor}-${group.material}-${group.colorName}`}
            vendor={group.vendor}
            material={group.material}
            colorName={group.colorName}
            spools={group.spools}
            onSpoolClick={handleSpoolClick}
          />
        ))}
      </IonList>
    );
  };

  const pageTitle = <>Spools {isFilterActive && ' [Filter Active]'}</>;

  return (
    <Page
      title={pageTitle}
      headerButton={
        <IonButton onClick={() => setFilterModalOpen(true)} color={isFilterActive ? 'primary' : 'dark'}>
          <IonIcon slot="icon-only" icon={filter} />
        </IonButton>
      }
    >
      <IonLoading isOpen={isRefetching} message="Refreshing..." />
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>

      {renderContent()}

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

      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonIcon icon={add} />
        </IonFabButton>
        <IonFabList side="top">
          <IonFabButton routerLink="/search-filaments">
            <IonIcon icon={searchOutline} />
          </IonFabButton>
          <IonFabButton routerLink="/add-by-form">
            <IonIcon icon={keypadOutline} />
          </IonFabButton>
          <IonFabButton routerLink="/add-by-barcode">
            <IonIcon icon={barcodeOutline} />
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </Page>
  );
};

/******************************************************************************/
