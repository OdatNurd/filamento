/******************************************************************************/

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { generateId } from '@utility/id';
import { useEffect, useState } from 'react';
import { LocationStyleModal } from './LocationStyleModal';

/******************************************************************************/

export const LocationModal = ({
  isOpen,
  onDidDismiss,
  mode,
  locationToEdit,
  setLocationToEdit,
  showSelector,
  handleSave,
  locationsState,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('primary');
  const [icon, setIcon] = useState('cube-outline');
  const [error, setError] = useState('');
  const [isStyleModalOpen, setStyleModalOpen] = useState(false);

  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (isEditMode && locationToEdit) {
      const location = locationsState.find(loc => loc.id === locationToEdit);
      if (location) {
        setName(location.name);
        setDescription(location.description || '');
        setColor(location.color || 'primary');
        setIcon(location.icon || 'cube-outline');
        setError('');
      }
    } else {
      setName('');
      setDescription('');
      setColor('primary');
      setIcon('cube-outline');
      setError('');
    }
  }, [locationToEdit, isEditMode, locationsState]);

  const onSaveChanges = () => {
    const trimmedName = name.trim();
    if (isEditMode && !locationToEdit) {
      setError('You must select a location to edit.');
      return;
    }
    if (!trimmedName) {
      setError('Location name cannot be empty.');
      return;
    }

    const nameExists = locationsState.some(
      loc => loc.name.toLowerCase() === trimmedName.toLowerCase() && loc.id !== locationToEdit,
    );

    if (nameExists) {
      setError('This location name already exists.');
      return;
    }

    handleSave({
      id: isEditMode ? locationToEdit : generateId(),
      name: trimmedName,
      description: description.trim(),
      color,
      icon,
    });
    onDidDismiss();
  };

  const handleNameInput = e => {
    setName(e.detail.value);
    if (error) setError('');
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss} swipeToClose={true}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{isEditMode ? 'Edit Location' : 'Add New Location'}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onDidDismiss}>Cancel</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {isEditMode && showSelector && (
            <IonItem>
              <IonLabel>Location to Edit</IonLabel>
              <IonSelect
                value={locationToEdit}
                placeholder="Select One"
                onIonChange={e => setLocationToEdit(e.detail.value)}
                interfaceOptions={{ cssClass: 'custom-select-popover' }}
              >
                {locationsState?.map(loc => (
                  <IonSelectOption key={loc.id} value={loc.id}>
                    {loc.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          )}
          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput
              value={name}
              onIonInput={handleNameInput}
              placeholder="Enter a unique name"
              disabled={isEditMode && !locationToEdit}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonInput
              value={description}
              onIonInput={e => setDescription(e.detail.value)}
              placeholder="Enter an optional description"
              disabled={isEditMode && !locationToEdit}
            />
          </IonItem>
          {error && (
            <IonNote color="danger" style={{ paddingLeft: '16px', paddingTop: '4px', display: 'block' }}>
              {error}
            </IonNote>
          )}

          <IonItem lines="full">
            <IonLabel>Appearance</IonLabel>
            <IonButton
              slot="end"
              onClick={() => setStyleModalOpen(true)}
              color={color}
              disabled={isEditMode && !locationToEdit}
            >
              <IonIcon icon={icon} />
            </IonButton>
          </IonItem>

          <IonButton
            expand="block"
            onClick={onSaveChanges}
            style={{ marginTop: '20px' }}
            disabled={isEditMode && !locationToEdit}
          >
            {isEditMode ? 'Save Changes' : 'Create Location'}
          </IonButton>
        </IonContent>
      </IonModal>
      <LocationStyleModal
        isOpen={isStyleModalOpen}
        onDidDismiss={() => setStyleModalOpen(false)}
        selectedColor={color}
        onColorChange={setColor}
        selectedIcon={icon}
        onIconChange={setIcon}
      />
    </>
  );
};

/******************************************************************************/
