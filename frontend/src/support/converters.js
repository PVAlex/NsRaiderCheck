export const ranks = {
  0: 'Глава гильдии',
  1: 'Рейд_Лидер',
  2: 'Офицер',
  3: 'Рейдер',
  4: 'Щупло',
  5: 'Легенда ЕО',
  6: 'Друг',
  7: 'Альт',
  8: 'Триал',
};

export const classes = {
  1: 'Воин',
  2: 'Паладин',
  3: 'Охотник',
  4: 'Разбойник',
  5: 'Жрец',
  6: 'Рыцарь смерти',
  7: 'Шаман',
  8: 'Маг',
  9: 'Чернокнижник',
  10: 'Монах',
  11: 'Друид',
  12: 'Охотник на демонов',
};

export const races = {
  1: 'Человек',
  2: 'Орк',
  3: 'Дворф',
  4: 'Ночной эльф',
  5: 'Нежить',
  6: 'Таурен',
  7: 'Гном',
  8: 'Тролль',
  9: 'Гоблин',
  10: 'Эльф крови',
  11: 'Дреней',
  22: 'Ворген',
  24: 'Пандарен',
  25: 'Пандарен',
  26: 'Пандарен',
  27: 'Ночнорожденный',
  29: 'Эльф Бездны',
  30: 'Озаренный дреней',
  31: 'Зандалар',
  32: 'Култирасец',
  34: 'Дворф из клана Черного Железа',
  35: 'Вульпера',
  36: "Маг'хар",
  37: 'Механогном',
};

export function rankConverter(rank) {
  return ranks[rank];
}

export function classConverter(c) {
  return classes[c];
}

export function raceConverter(race) {
  return races[race];
}
