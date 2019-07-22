package ru.nsguild.raidercheck.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;
import ru.nsguild.raidercheck.api.blizzard.Character;
import ru.nsguild.raidercheck.api.rio.Rio;
import ru.nsguild.raidercheck.entity.Member;

@Component
public class MemberRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Перезаписать существующую или создать новую запись о персонаже.
     *
     * @param member персонаж.
     * @return записанного персонажа.
     */
    public Member save(Member member) {
        return mongoTemplate.save(member);
    }

    /**
     * Удалить персонажа по имени.
     *
     * @param name имя персонажа.
     */
    public void delete(String name) {
        mongoTemplate.remove(Query.query(Criteria.where("name").is(name)));
    }

    /**
     * Удалить персонажей по именам.
     *
     * @param names список имён персонажей.
     */
    public void delete(List<String> names) {
        mongoTemplate.remove(Query.query(Criteria.where("name").in(names)));
    }

    /**
     * Получить список всех персонажей.
     *
     * @return список персонажей.
     */
    public List<Member> findAll() {
        return mongoTemplate.findAll(Member.class);
    }


    /**
     * Получить персонажа по имени.
     *
     * @param name имя персонажа.
     * @return персонаж.
     */
    public Member findByName(String name) {
        return mongoTemplate.findOne(Query.query(Criteria.where("name").is(name)), Member.class);
    }

    /**
     * Получить персонажей по имени.
     *
     * @param names имена персонажей.
     * @return список персонажей.
     */
    public List<Member> findByName(List<String> names) {
        return mongoTemplate.find(Query.query(Criteria.where("name").in(names)), Member.class);
    }

    /**
     * Получить имена всех персонажей.
     *
     * @return имена персонажей.
     */
    public List<Member> findAllMembers() {
        final Query query = new Query();
        query.fields().include("name").include("rank").include("guildMembership");
        return mongoTemplate.find(query, Member.class);
    }

    /**
     * Получить имена персонажей по рангу в гильдии.
     *
     * @param rank список рангов.
     * @return список персонажей.
     */
    public List<Member> findMembers(Map<String, String> params) {
        final Query query = new Query();
        query.addCriteria(mapToCriteria(params));
        query.fields().include("name").include("rank").include("guildMembership");
        return mongoTemplate.find(query, Member.class);
    }

    /**
     * Получить список пройденных м+ за неделю.
     *
     * @return список м+
     */
    public List<Rio> findAllRio() {
        return mongoTemplate.findDistinct("rio", Member.class, Rio.class);
    }

    /**
     * Получить список пройденных м+ за неделю по рангам персонажей.
     *
     * @param params параметры для поиска.
     * @return список м+
     */
    public List<Rio> findRio(Map<String, String> params) {
        return mongoTemplate.findDistinct(Query.query(mapToCriteria(params)),
                "rio", Member.class, Rio.class);
    }

    /**
     * Получить информацию обо всех персонажах.
     *
     * @return список персонажей.
     */
    public List<Character> findAllCharacters() {
        return mongoTemplate.findDistinct("character", Member.class, Character.class);
    }

    /**
     * Получить информацию о персонажах по рангам.
     *
     * @param params список параметров
     * @return список персонажей
     */
    public List<Character> findCharacters(Map<String, String> params) {
        return mongoTemplate.findDistinct(Query.query(mapToCriteria(params)),
                "character", Member.class, Character.class);
    }

    /**
     * Получение списка всех персонажей.
     *
     * @see org.springframework.data.mongodb.core.MongoOperations#stream(Query, Class)
     * @param consumer {@link Consumer}
     */
    public void stream(Consumer<? super Member> consumer) {
        mongoTemplate.stream(new Query(), Member.class).forEachRemaining(consumer);
    }

    /**
     * Получение {@link Criteria} для поиска в базе.
     *
     * @param params параметры для поиска
     * @return {@link Criteria}
     */
    private Criteria mapToCriteria(Map<String, String> params) {
        final List<Criteria> criterias = new ArrayList<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            final String param = entry.getKey();
            final String value = entry.getValue();
            if (value.contains(",")) {
                final Object[] values = Arrays.stream(value.split(","))
                        .map(s -> NumberUtils.isNumber(s) ? Integer.valueOf(s) : s)
                        .toArray();
                criterias.add(new Criteria(param).in(values));
            } else {
                criterias.add(new Criteria(param).is(NumberUtils.isNumber(value) ? Integer.valueOf(value) : value));
            }
        }
        return criterias.size() > 1 ? new Criteria().andOperator(criterias.toArray(new Criteria[0])) : criterias.get(0);
    }



}
