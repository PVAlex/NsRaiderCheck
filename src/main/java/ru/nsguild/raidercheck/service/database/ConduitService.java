package ru.nsguild.raidercheck.service.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import ru.nsguild.raidercheck.CacheConfig;
import ru.nsguild.raidercheck.dao.blizzard.Conduit;
import ru.nsguild.raidercheck.dao.blizzard.Spell;
import ru.nsguild.raidercheck.repository.ConduitRepository;
import ru.nsguild.raidercheck.requests.EntityRequest;

import java.util.HashMap;
import java.util.Map;

@Service
public class ConduitService {

    @Autowired
    private ConduitRepository repository;
    @Autowired
    private EntityRequest<Conduit> conduitRequest;

    @Cacheable(cacheNames = CacheConfig.CONDUIT, key = "'conduit-'+#p0", sync = true)
    public Spell getSpell(Integer conduitId) {
        final Conduit conduit = repository.findById(conduitId).orElseGet(() -> {
            final Map<String, String> params = new HashMap<>();
            params.put("id", conduitId.toString());
            final Conduit c = conduitRequest.getEntity(params);
            repository.save(c);
            return c;
        });
        return !conduit.getRanks().isEmpty()
                ? conduit.getRanks().get(0).getSpellTooltip()
                : null;
    }

}
