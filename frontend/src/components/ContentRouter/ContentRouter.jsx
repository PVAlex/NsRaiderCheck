import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import {
  ProfessionsTable, ProfileTable, ReputationsTable, RioTable, SpecializationTable,
} from '@ns/components/Table';
import GearTable from '../Table/GearTable';

const ContentRouter = () => (
  <Switch>
    <Route path="/wow/profile">
      <ProfileTable />
    </Route>
    <Route path="/wow/gear">
      <GearTable />
    </Route>
    <Route path="/wow/spec-and-covenant">
      <SpecializationTable />
    </Route>
    <Route path="/wow/professions">
      <ProfessionsTable />
    </Route>
    <Route path="/wow/reputations">
      <ReputationsTable />
    </Route>
    <Route path="/rio">
      <RioTable />
    </Route>
    <Route path="/">
      <Redirect to="/wow/profile" />
    </Route>
  </Switch>
);

export default ContentRouter;
