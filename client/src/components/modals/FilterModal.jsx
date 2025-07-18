/******************************************************************************/

import {
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from '@ionic/react';

/******************************************************************************/

export const FilterModal = ({
  isOpen,
  onDidDismiss,
  filterOptions,
  filters,
  handleFilterChange,
  resetFilters,
  showEmpty,
  setShowEmpty,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss} initialBreakpoint={0.5} breakpoints={[0, 0.5, 1]}>
      <IonContent className="ion-padding">
        <h2 style={{ paddingLeft: '16px' }}>Filter Inventory</h2>
        <IonItem>
          <IonLabel>Brand</IonLabel>
          <IonSelect
            multiple={true}
            value={filters.brand}
            onIonChange={e => handleFilterChange('brand', e.detail.value)}
            interfaceOptions={{ cssClass: 'custom-select-popover' }}
          >
            {filterOptions.brands.map(brand => (
              <IonSelectOption key={brand} value={brand}>
                {brand}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>Material</IonLabel>
          <IonSelect
            multiple={true}
            value={filters.material}
            onIonChange={e => handleFilterChange('material', e.detail.value)}
            interfaceOptions={{ cssClass: 'custom-select-popover' }}
          >
            {filterOptions.materials.map(material => (
              <IonSelectOption key={material} value={material}>
                {material}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>Color</IonLabel>
          <IonSelect
            multiple={true}
            value={filters.color}
            onIonChange={e => handleFilterChange('color', e.detail.value)}
            interfaceOptions={{ cssClass: 'custom-select-popover' }}
          >
            {filterOptions.colors.map(color => (
              <IonSelectOption key={color} value={color}>
                {color}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Show Empty Spools</IonLabel>
          <IonToggle slot="end" checked={showEmpty} onIonChange={e => setShowEmpty(e.detail.checked)} />
        </IonItem>
        <IonButton expand="block" onClick={resetFilters} color="danger" style={{ margin: '16px' }}>
          Reset
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

/******************************************************************************/
