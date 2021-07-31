import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';

// Import custom components
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import RestrictRoute from './RestrictRoute';
import MainLayout from '../components/common/layout/MainLayout';
import NotFound from '../components/error/NotFound';

const InventoryListContainer = loadable(() => import('../containers/inventory/InventoryListContainer'));
const SaleContainer = loadable(() => import('../containers/inventory/SaleContainer'));

const Router = () => (
  <Fragment>
    <Switch>
      <PublicRoute exact path="/" component={InventoryListContainer} />
      <PublicRoute exact path="/sale" component={SaleContainer} />
      <Route component={NotFound} />
    </Switch>
  </Fragment>
);

export default Router;
