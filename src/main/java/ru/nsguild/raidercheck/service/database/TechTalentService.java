package ru.nsguild.raidercheck.service.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import ru.nsguild.raidercheck.CacheConfig;
import ru.nsguild.raidercheck.dao.blizzard.Spell;
import ru.nsguild.raidercheck.dao.blizzard.TechTalent;
import ru.nsguild.raidercheck.repository.TechTalentRepository;
import ru.nsguild.raidercheck.requests.EntityRequest;

import java.util.HashMap;
import java.util.Map;

@Service
public class TechTalentService {

    @Autowired
    private TechTalentRepository repository;
    @Autowired
    private EntityRequest<TechTalent> techTalentRequest;

    @Cacheable(cacheNames = CacheConfig.TECH_TALENT, key = "'techTalent-'+#p0", sync = true)
    public Spell getSpell(Integer techTalentId) {
        final TechTalent techTalent = repository.findById(techTalentId).orElseGet(() -> {
            final Map<String, String> params = new HashMap<>();
            params.put("id", techTalentId.toString());
            final TechTalent t = techTalentRequest.getEntity(params);
            repository.save(t);
            return t;
        });
        return techTalent.getSpellTooltip();
    }
}
