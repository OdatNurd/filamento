/******************************************************************************/

import { ClerkProvider as InternalClerkProvider } from '@clerk/clerk-react';
import { useHistory } from 'react-router-dom';

/******************************************************************************/

if (!__CLERK_PUBLISHABLE_KEY__) {
  throw new Error('Application is not properly set up for Clerk; check the deployment');
}

/******************************************************************************/

export const ClerkProvider = ({ children }) => {
  const history = useHistory();
  return (
    <InternalClerkProvider
      publishableKey={__CLERK_PUBLISHABLE_KEY__}
      navigate={to => history.push(to)}
      onSignOut={() => history.push('/')}
    >
      {children}
    </InternalClerkProvider>
  );
};

/******************************************************************************/
