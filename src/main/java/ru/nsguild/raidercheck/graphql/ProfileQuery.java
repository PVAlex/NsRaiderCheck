package ru.nsguild.raidercheck.graphql;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.execution.AbortExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.service.ProfileService;

import java.util.List;

@Component
public class ProfileQuery implements GraphQLQueryResolver {

    @Autowired
    private ProfileService profileService;

    public List<Profile> getAll() {
        return profileService.findAllProfiles();
    }

    public Profile byName(String name) {
        return profileService.findByName(name).orElseThrow(() ->
                new AbortExecutionException("Profile not found"));
    }
}
