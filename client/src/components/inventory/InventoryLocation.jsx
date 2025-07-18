/******************************************************************************/

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { InventoryIcon } from '@inventory/InventoryIcon';
import { IonIcon, IonItem, IonLabel, IonNote } from '@ionic/react';
import { cubeOutline } from 'ionicons/icons';
import ReactDOM from 'react-dom';
import './Inventory.css';

/******************************************************************************/

export const InventoryLocation = ({
  id,
  name,
  description,
  color,
  icon,
  items,
  totalItemCount,
  isFilterActive,
  onSpoolClick,
}) => {
  const portal = document.getElementById('main-content');
  const isEffectivelyEmpty = items.length === 0;

  const renderSpoolCount = () => {
    if (totalItemCount === 0) {
      return null;
    }

    const spoolText = totalItemCount === 1 ? 'spool' : 'spools';
    const visibleCount = items.length;

    let text;
    if (isFilterActive && visibleCount < totalItemCount) {
      text = `(${visibleCount} of ${totalItemCount} ${spoolText})`;
    } else {
      text = `(${totalItemCount} ${spoolText})`;
    }

    return (
      <IonNote slot="end" className="spool-count">
        {text}
      </IonNote>
    );
  };

  return (
    <Droppable droppableId={id} type="spool" direction="horizontal">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`location-section ${snapshot.isDraggingOver ? 'location-section-dragging-over' : ''} ${
            isEffectivelyEmpty ? 'location-section-empty' : ''
          }`}
        >
          <IonItem lines="none" color="transparent" className="location-title">
            <IonIcon
              icon={icon || cubeOutline}
              slot="start"
              color={snapshot.isDraggingOver ? 'light' : color}
            />
            <IonLabel>
              <h2>
                {name}
                {description && <span className="location-description"> - {description}</span>}
              </h2>
            </IonLabel>
            {renderSpoolCount()}
          </IonItem>
          <div className={`location-drop-zone ${isEffectivelyEmpty ? 'drop-zone-empty' : ''}`}>
            {items.length > 0 ? (
              items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => {
                    const style = {
                      ...provided.draggableProps.style,
                    };

                    const child = (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={style}
                      >
                        <InventoryIcon {...item} onSpoolClick={() => onSpoolClick(item)} />
                      </div>
                    );

                    if (!snapshot.isDragging) {
                      return child;
                    }

                    return ReactDOM.createPortal(child, portal || document.body);
                  }}
                </Draggable>
              ))
            ) : (
              <div className="empty-location-text">Drag filaments here</div>
            )}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

/******************************************************************************/
