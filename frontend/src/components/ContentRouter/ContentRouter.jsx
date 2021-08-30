import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import {
  ProfessionsTable, ProfileTable, ReputationsTable, RioTable, SpecializationTable,
} from '@ns/components/Table';
import BisBossesTable from '../Table/BisBossesTable';
import BisEquipmentTable from '../Table/BisEquipmentTable';
import EquipmentTable from '../Table/EquipmentTable';

const ContentRouter = () => (
  <Switch>
    <Route path="/wow/profile">
      <ProfileTable />
    </Route>
    <Route path="/wow/equipment">
      <EquipmentTable />
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
    <Route path="/bislist/equipment">
      <BisEquipmentTable />
    </Route>
    <Route path="/bislist/bosses">
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <BisBossesTable />
    </Route>
    <Route path="/">
      <Redirect to="/wow/profile" />
    </Route>
  </Switch>
);

export default ContentRouter;
