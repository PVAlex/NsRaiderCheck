import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import GearTable from '../Table/GearTable';
import ProfessionsTable from '../Table/ProfessionsTable';
import ProfileTable from '../Table/ProfileTable';
import ReputationsTable from '../Table/ReputationsTable';
import RioTable from '../Table/RioTable';
import SpecializationTable from '../Table/SpecializationTable';

const ContentRouter = () => (
  <Switch>
    <Route path="/wow/profile">
      <ProfileTable />
    </Route>
    <Route path="/wow/gear">
      <GearTable />
    </Route>
    <Route path="/wow/spec">
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
