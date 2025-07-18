/******************************************************************************/

import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { archiveOutline, statsChartOutline } from 'ionicons/icons';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import { SpoolIcon } from '@icons/SpoolIcon';
import { AddByBarcode } from '@pages/AddByBarcode';
import { AddByForm } from '@pages/AddByForm';
import { Brands } from '@pages/Brands';
import { Inventory } from '@pages/Inventory';
import { Materials } from '@pages/Materials';
import { NotFound } from '@pages/NotFound';
import { SearchFilaments } from '@pages/SearchFilaments';
import { Spools } from '@pages/Spools';
import { Stats } from '@pages/Stats';
import { UserProfile } from '@pages/UserProfile';

/******************************************************************************/

export const MainApp = () => {
  const location = useLocation();

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          <Route exact path="/app/spools" component={Spools} />
          <Route exact path="/app/stats" component={Stats} />
          <Route exact path="/app/inventory" component={Inventory} />
          <Route exact path="/app/brands" component={Brands} />
          <Route exact path="/app/materials" component={Materials} />
          <Route path="/app/user-profile" component={UserProfile} />
          <Route exact path="/app/add-by-barcode" component={AddByBarcode} />
          <Route exact path="/app/add-by-form" component={AddByForm} />
          <Route exact path="/app/search-filaments" component={SearchFilaments} />
          <Redirect exact from="/app" to="/app/spools" />
          <Route component={NotFound} />
        </Switch>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="spools" href="/app/spools" selected={location.pathname.startsWith('/app/spools')}>
          <SpoolIcon />
          <IonLabel>Spools</IonLabel>
        </IonTabButton>
        <IonTabButton tab="stats" href="/app/stats" selected={location.pathname === '/app/stats'}>
          <IonIcon icon={statsChartOutline} />
          <IonLabel>Stats</IonLabel>
        </IonTabButton>
        <IonTabButton tab="inventory" href="/app/inventory" selected={location.pathname === '/app/inventory'}>
          <IonIcon icon={archiveOutline} />
          <IonLabel>Inventory</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

/******************************************************************************/
