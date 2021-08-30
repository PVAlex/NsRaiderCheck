package ru.nsguild.raidercheck;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import ru.nsguild.raidercheck.dao.BisItem;
import ru.nsguild.raidercheck.dao.Profile;
import ru.nsguild.raidercheck.dao.blizzard.Detail;
import ru.nsguild.raidercheck.service.database.BisService;
import ru.nsguild.raidercheck.service.database.ProfileService;
import ru.nsguild.raidercheck.service.support.TaskService;
import ru.nsguild.raidercheck.support.ClassConverter;
import ru.nsguild.raidercheck.dao.Instance;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class NsRaiderCheckApplicationTests {

    private static final Logger logger = LoggerFactory.getLogger(NsRaiderCheckApplicationTests.class);

    @Autowired
    private ProfileService profileService;
    @Autowired
    private TaskService raiderCheckService;
    @Autowired
    private BisService bisService;
    @Value("#{${guild.ranks}}")
    private Map<Integer, String> ranks;

//    @Ignore
    @Test
    public void contextLoads() {
        raiderCheckService.refreshProfiles();
    }

    @Test
    public void checkProfiles() {
        final List<Profile> profiles = profileService.findAllProfiles();
        profiles.forEach(profile -> bisService.checkItems(profile));

        final List<BisItem> bisItems = bisService.getItemsByInstance(Instance.SANCTUM_OF_DOMINATION);
        Assert.assertNotEquals(profiles.isEmpty(), true);
    }

    @Test
    public void loadToFile() {
        final List<Profile> all = profileService.findAllProfiles();
        try (Workbook workbook = new HSSFWorkbook()) {
            Sheet sheet = workbook.createSheet();
            Row row = sheet.createRow(0);
            row.createCell(0).setCellValue("Имя");
            row.createCell(1).setCellValue("Класс");
            row.createCell(2).setCellValue("Спек");
            row.createCell(3).setCellValue("Ранг");
            row.createCell(4).setCellValue("Илвл");
            row.createCell(5).setCellValue("Ковенант");
            row.createCell(6).setCellValue("Извесность");

            int count = 1;
            for (Profile profile : all) {
                final Row newRow = sheet.createRow(count);
                newRow.createCell(0).setCellValue(profile.getName());
                newRow.createCell(1).setCellValue(ClassConverter.getById(profile.getCharacterClass()));
                newRow.createCell(2).setCellValue(profile.getSpecialization().getSpecialization().getName());
                newRow.createCell(3).setCellValue(ranks.get(profile.getRank()));
                newRow.createCell(4).setCellValue(profile.getMedianIlvl());
                newRow.createCell(5).setCellValue(Optional.ofNullable(profile.getChosenCovenant()).orElse(new Detail()).getName());
                newRow.createCell(6).setCellValue(Optional.ofNullable(profile.getRenownLevel()).orElse(0).toString());
                count++;
            }
            final File file = new File("src/test/resources/1.xlsx");
            workbook.write(new FileOutputStream(file));
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
    }

    @Test
    public void clear() {
        raiderCheckService.clearNonGuildMembers();
    }

    @Test
    public void refreshBisList() {
        raiderCheckService.refreshBisItems();
        final List<BisItem> bisItems = bisService.getItemsByInstance(Instance.SANCTUM_OF_DOMINATION);
        Assert.assertFalse(bisItems.isEmpty());
    }

}
