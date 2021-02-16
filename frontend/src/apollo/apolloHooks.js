import { useQuery } from '@apollo/client';
import {
  GetProfiles,
  GetEquippedItems,
  GetSpecialization,
  GetReputations,
  GetCovenant,
  GetProfessions,
  GetRio,
} from './graphqlRequests.graphql';

export function useProfilesQuery() {
  // const { loading, data: { all = [] } = {} } = useQuery(GetProfiles);
  // return { loading, profiles: all };
  return useQuery(GetProfiles);
}
export function useEquippedItemsQuery() {
  const {
    loading,
    data: { all = [] } = {},
  } = useQuery(GetEquippedItems);
  return { loading, profiles: all };
}

export function useSpecializationQuery() {
  const {
    loading,
    data: { all = [] } = {},
  } = useQuery(GetSpecialization);
  return { loading, profiles: all };
}

export function useProfessionsQuery() {
  const {
    loading,
    data: { all = [] } = {},
  } = useQuery(GetProfessions);
  return { loading, profiles: all };
}

export function useCovenantQuery() {
  const {
    loading,
    data: { all = [] } = {},
  } = useQuery(GetCovenant);
  return { loading, profiles: all };
}

export function useReputationsQuery() {
  const {
    loading,
    data: { all = [] } = {},
  } = useQuery(GetReputations, {
    variables: {
      ids: [2439, 2464, 2413, 2407, 2410, 2445, 2432, 2465, 2462],
    },
  });
  return { loading, profiles: all };
}

export function useRioQuery() {
  const {
    loading,
    data: { all = [] } = {},
  } = useQuery(GetRio);
  return { loading, profiles: all };
}
