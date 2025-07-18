/******************************************************************************/

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { IonButton, IonIcon } from '@ionic/react';
import { reorderTwoOutline } from 'ionicons/icons';
import './Inventory.css';

/******************************************************************************/

const NOT_IN_STORAGE_ID = 'not-in-storage';

export const InventorySidebar = ({
  locations,
  locationOrder,
  toggledLocations,
  onToggleLocation,
  onLongPressLocation,
}) => {
  const handleContextMenu = (e, id) => {
    e.preventDefault();
    onLongPressLocation(id);
  };

  const draggableLocations = locationOrder;
  const notInStorageLocation = locations[NOT_IN_STORAGE_ID];

  return (
    <Droppable droppableId="sidebar" type="location">
      {provided => (
        <div className="sidebar-container" {...provided.droppableProps} ref={provided.innerRef}>
          {draggableLocations.map((id, index) => {
            const loc = locations[id];
            if (!loc) return null;

            return (
              <Draggable key={id} draggableId={id} index={index}>
                {provided => (
                  <div
                    className="sidebar-item-container"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    onContextMenu={e => handleContextMenu(e, id)}
                  >
                    <IonButton
                      expand="block"
                      fill={toggledLocations.has(id) ? 'solid' : 'outline'}
                      className="sidebar-button"
                      onClick={() => onToggleLocation(id)}
                      color={loc.color || 'primary'}
                    >
                      {loc.name}
                    </IonButton>
                    <div className="drag-handle" {...provided.dragHandleProps}>
                      <IonIcon icon={reorderTwoOutline} />
                    </div>
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}

          {notInStorageLocation && (
            <div key={notInStorageLocation.id} className="sidebar-item-container">
              <IonButton
                expand="block"
                fill={toggledLocations.has(notInStorageLocation.id) ? 'solid' : 'outline'}
                className="sidebar-button"
                onClick={() => onToggleLocation(notInStorageLocation.id)}
                color="medium"
              >
                {notInStorageLocation.name}
              </IonButton>
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
};

/******************************************************************************/
