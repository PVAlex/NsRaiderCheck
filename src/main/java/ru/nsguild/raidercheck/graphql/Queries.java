package ru.nsguild.raidercheck.graphql;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.execution.AbortExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.BisItem;
import ru.nsguild.raidercheck.dao.BisProfile;
import ru.nsguild.raidercheck.dao.Instance;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.service.database.BisService;
import ru.nsguild.raidercheck.service.database.ProfileService;

import java.util.List;

@Component
public class Queries implements GraphQLQueryResolver {

    @Autowired
    private ProfileService profileService;
    @Autowired
    private BisService bisService;

    public List<Profile> getAll() {
        return profileService.findAllProfiles();
    }

    public Profile byName(String name) {
        return profileService.findByName(name).orElseThrow(() ->
                new AbortExecutionException("Profile not found"));
    }

    public List<BisItem> bisItems() {
        return bisService.getItemsByInstance(Instance.SANCTUM_OF_DOMINATION);
    }

    public List<BisProfile> bisProfiles() {
        return bisService.findAllProfiles();
    }
}
