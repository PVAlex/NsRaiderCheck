package ru.nsguild.raidercheck.service.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.nsguild.raidercheck.dao.BisItem;
import ru.nsguild.raidercheck.dao.Instance;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.requests.EntityRequest;
import ru.nsguild.raidercheck.requests.FieldRequest;

import java.util.HashMap;
import java.util.List;

/**
 * Сервис получения данных из api.
 */
@Service
public class ApiService {

    @Autowired
    private EntityRequest<List<Profile>> profileRequest;
    @Autowired
    private List<FieldRequest<Profile>> fieldRequests;
    @Autowired
    private EntityRequest<List<BisItem>> bisItemsRequest;

    public List<Profile> refreshAll() {
        return fillProfiles(getProfiles());
    }

    public List<Profile> refreshAll(List<Profile> profiles) {
        return fillProfiles(profiles);
    }

    /**
     * Получение списка персонажей из выбранной гильдии.
     *
     * @return список персонажей.
     */
    public List<Profile> getProfiles() {
        return profileRequest.getEntity();
    }

    /**
     * Заполнение профилей персонажей.
     *
     * @param profiles список профилей
     * @return список с заполненными профилями.
     */
    private List<Profile> fillProfiles(List<Profile> profiles) {
        // TODO раскомментировать когда починят 429
        profiles./*parallelStream().*/forEach(profile -> {
            fieldRequests./*parallelStream().*/forEach(request -> request.fill(profile));
        });
        return profiles;
    }

    public List<BisItem> getBisItems() {
        final HashMap<String, String> params = new HashMap<>();
        params.put("id", Instance.SANCTUM_OF_DOMINATION.id.toString());
        return bisItemsRequest.getEntity(params);
    }
}
