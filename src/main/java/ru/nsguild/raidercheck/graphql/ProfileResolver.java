package ru.nsguild.raidercheck.graphql;

import com.coxautodev.graphql.tools.GraphQLResolver;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.dao.blizzard.Reputation;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProfileResolver implements GraphQLResolver<Profile> {

    public List<Reputation> reputations(Profile profile, List<Integer> ids) {
        return profile.getReputations() != null
            ? profile.getReputations()
                .stream().filter(reputation -> ids.contains(reputation.getFaction().getId()))
                .collect(Collectors.toList())
            : null;
    }

}
