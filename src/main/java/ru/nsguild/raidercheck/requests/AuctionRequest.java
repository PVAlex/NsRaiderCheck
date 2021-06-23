package ru.nsguild.raidercheck.requests;

import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.dao.AuctionItem;

import java.util.List;
import java.util.Map;

@Component
public class AuctionRequest extends BlizzardApiRequest implements EntityRequest<List<AuctionItem>> {
    @Override
    public List<AuctionItem> getEntity(Map<String, String> params) {
        return null;
    }
}
