package ru.nsguild.raidercheck.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.nsguild.raidercheck.dao.IconMedia;
import ru.nsguild.raidercheck.dao.blizzard.Asset;
import ru.nsguild.raidercheck.repository.IconRepository;
import ru.nsguild.raidercheck.requests.EntityRequest;

import java.util.HashMap;

@Service
public class IconService {

    private static final Logger logger = LoggerFactory.getLogger(IconService.class);

    private static final String ITEM_MEDIA = "item";
    private static final String SPELL_MEDIA = "spell";

    @Autowired
    private IconRepository iconRepository;
    @Autowired
    private EntityRequest<Asset> mediaRequest;

    public Asset getSpellIcon(Integer spellId) {
        return getIcon(spellId, SPELL_MEDIA);
    }

    public Asset getItemIcon(Integer itemId) {
        return getIcon(itemId, ITEM_MEDIA);
    }

    private Asset getIcon(Integer id, String mediaType) {
        return iconRepository.findBySharedIdContaining(id).orElseGet(() -> {
            final HashMap<String, String> params = new HashMap<>();
            params.put("type", mediaType);
            params.put("id", id.toString());
            final Asset entity = mediaRequest.getEntity(params);
            return save(entity, id);
        }).getMedia();
    }

    private IconMedia save(Asset media, Integer sharedId) {
        final IconMedia iconMedia = iconRepository.findById(media.getFileDataId()).orElse(new IconMedia());
        if (!iconMedia.getSharedId().contains(sharedId)) {
            iconMedia.setId(media.getFileDataId());
            iconMedia.setMedia(media);
            iconMedia.getSharedId().add(sharedId);
            iconRepository.save(iconMedia);
        }
        return iconMedia;
    }
}
