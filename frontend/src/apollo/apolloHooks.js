import { useMutation, useQuery } from '@apollo/client';
import {
  GetProfiles,
  GetEquippedItems,
  GetSpecialization,
  GetReputations,
  GetCovenant,
  GetProfessions,
  GetRio,
  GetBisItems,
  GetBisProfiles,
  SetBisItem,
} from './graphqlRequests.graphql';

export function useProfilesQuery() {
  const {
    loading,
    data: { all = [] } = {},
  } = useQuery(GetProfiles);
  return { loading, profiles: all };
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
      ids: [2439, 2464, 2413, 2407, 2410, 2445, 2432, 2465, 2462, 2472, 2470],
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

export function useBisItemsQuery() {
  const {
    loading,
    data: { bisItems = [] } = {},
  } = useQuery(GetBisItems);
  return { loading, items: bisItems };
}

export function useBisProfilesQuery() {
  const {
    loading,
    data: { bisProfiles = [] } = {},
    refetch,
  } = useQuery(GetBisProfiles);
  return { loading, profiles: bisProfiles, refetch };
}

export function useSetBisItemMutation(onCompleted) {
  const [saveFunc, mutationResult] = useMutation(SetBisItem, { onCompleted });
  return {
    save: ((name, slot, itemId) => saveFunc({
      variables: {
        name,
        slot,
        itemId,
      },
    })),
    loading: mutationResult.loading,
    profile: mutationResult.data,
  };
}
