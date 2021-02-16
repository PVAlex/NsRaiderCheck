import React from 'react';
import Table from './Table';

const columns = [
  {
    key: 'name',
    name: 'Имя',
    frozen: true,
    sortable: true,
    width: 150,
  },
  {
    key: 'rank',
    name: 'Ранг',
    sortable: true,
    width: 150,
  },
  {
    key: 'head',
    name: 'Голова',
    width: itemColumnWidth,
  },
  {
    key: 'neck',
    name: 'Шея',
    width: itemColumnWidth,
  },
  {
    key: 'shoulder',
    name: 'Плечо',
    width: itemColumnWidth,
  },
  {
    key: 'back',
    name: 'Спина',
    width: itemColumnWidth,
  },
  {
    key: 'chest',
    name: 'Сундук',
    width: itemColumnWidth,
  },
  {
    key: 'wrist',
    name: 'Запястья',
    width: itemColumnWidth,
  },
  {
    key: 'hands',
    name: 'Кисти рук',
    width: itemColumnWidth,
  },
  {
    key: 'waist',
    name: 'Пояс',
    width: itemColumnWidth,
  },
  {
    key: 'legs',
    name: 'Ноги',
    width: itemColumnWidth,
  },
  {
    key: 'feet',
    name: 'Ступни',
    width: itemColumnWidth,
  },
  {
    key: 'finger_1',
    name: 'Палец',
    width: itemColumnWidth,
  },
  {
    key: 'finger_2',
    name: 'Палец',
    width: itemColumnWidth,
  },
  {
    key: 'trinket_1',
    name: 'Аксессуар',
    width: itemColumnWidth,
  },
  {
    key: 'trinket_2',
    name: 'Аксессуар',
    width: itemColumnWidth,
  },
  {
    key: 'main_hand',
    name: 'Правая рука',
    width: itemColumnWidth,
  },
  {
    key: 'off_hand',
    name: 'Левая рука',
    width: itemColumnWidth,
  },
];

const BisListTable = () => {

  return (
    <Table
      rows={}
      tableName="bisListTable"
      columns={columns} />
  );
};

export default BisListTable;
