package ru.nsguild.raidercheck.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.requests.EntityRequest;
import ru.nsguild.raidercheck.requests.FieldRequest;

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

    public List<Profile> getAll() {
        return fillProfiles(getProfiles());
    }

    public List<Profile> getAll(List<Profile> profiles) {
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
        profiles.parallelStream().forEach(profile -> {
            fieldRequests.parallelStream().forEach(request -> request.fill(profile));
        });
        return profiles;
    }
}
