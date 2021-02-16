package ru.nsguild.raidercheck.graphql;

import java.text.SimpleDateFormat;

import com.coxautodev.graphql.tools.GraphQLResolver;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.rio.Mythic;

@Component
public class MythicResolver implements GraphQLResolver<Mythic> {

    public String completedAt(Mythic mythic) {
        if (mythic.getCompletedAt() != null) {
            return new SimpleDateFormat("dd-MM-yy hh:mm").format(mythic.getCompletedAt());
        } else {
            return null;
        }
    }

}
