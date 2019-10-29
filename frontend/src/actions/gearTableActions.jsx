import React from 'react';
import axios from 'axios';
import {orderBy, sortBy} from 'lodash'

// types of action
const Types = {
        FETCH_GEAR_BEGIN: 'FETCH_GEAR_BEGIN',
        FETCH_GEAR_SUCCESS: 'FETCH_GEAR_SUCCESS',
        FETCH_GEAR_ERROR: 'FETCH_GEAR_ERROR',
        REFRESH_CHARACTER_BEGIN: 'REFRESH_CHARACTER_BEGIN',
        REFRESH_CHARACTER_SUCCESS: 'REFRESH_CHARACTER_SUCCESS',
        REFRESH_CHARACTER_ERROR: 'REFRESH_CHARACTER_ERROR',
        SORT_COLUMN: 'SORT_COLUMN'
    },

    columns = [{
        field: 'name',
        label: 'Имя',
    }, {
        field: 'spec',
        label: 'Специализация',
    }, {
        field: 'ilvl',
        label: 'Уровень предметов',
    }, {
        field: 'neck',
        label: 'Шея',
    }, {
        field: 'activeEssence',
        label: 'Активная эссенция'
    }, {
        field: 'passiveEssence1',
        label: 'Пассивная эссенция'
    }, {
        field: 'passiveEssence2',
        label: 'Пассивная эссенция'
    }, {
        field: 'head',
        label: 'Голова',
    }, {
        field: 'shoulder',
        label: 'Плечи',
    }, {
        field: 'back',
        label: 'Плащ',
    }, {
        field: 'chest',
        label: 'Грудь',
    }, {
        field: 'wrist',
        label: 'Запястья',
    }, {
        field: 'hands',
        label: 'Кисти рук',
    }, {
        field: 'waist',
        label: 'Пояс',
    }, {
        field: 'legs',
        label: 'Ноги',
    }, {
        field: 'feet',
        label: 'Ступни',
    }, {
        field: 'finger1',
        label: 'Кольцо',
    }, {
        field: 'finger2',
        label: 'Кольцо',
    }, {
        field: 'trinket1',
        label: 'Аксесуар',
    }, {
        field: 'trinket2',
        label: 'Аксессуар',
    }, {
        field: 'mainHand',
        label: 'Основное оружие',
    }, {
        field: 'offHand',
        label: 'Дополнительное оружие',
    }],

    // support
    handleGearResponse = (response) => {
        let getWhItem = (item) => {
                if (item) {
                    let tooltip = item.tooltipParams,
                        id = 'item=' + item.id,
                        ilvl = 'ilvl=' + item.itemLevel,
                        ench = tooltip.enchant ? ('ench=' + tooltip.enchant) : '',
                        gem = tooltip.gem0 ? ('gems=' + tooltip.gem0) : '',
                        bonus = 'bonus=' + item.bonusLists.join(':'),
                        azerite = item.azeriteEmpoweredItem.azeritePowers.length > 0
                            ? 'azerite-powers=' + item.azeriteEmpoweredItem.azeritePowers.map(power => power.id).join(':')
                            : '',
                        domain = 'domain=ru',
                        link = [id, ilvl, ench, gem, bonus, azerite, domain].filter(s => s !== '').join('&'),
                        whLink = 'http://ru.wowhead.com/item=' + item.id,
                        value = '[' + item.itemLevel + ']' + item.name;
                    return <a href={whLink} data-wowhead={link}>{value}</a>;
                } else {
                    return '';
                }
            },
            getWhEssence = (essences, slot) => {
                if (essences.length > 0 && essences[slot].rank) {
                    let essence = essences[slot],
                        spellTooltip = slot === 0 ? essence.main_spell_tooltip : essence.passive_spell_tooltip,
                        link = 'spell=' + spellTooltip.spell.id,
                        whLink = 'http://ru.wowhead.com/spell=' + spellTooltip.spell.id,
                        value = '[' + essence.rank + '] ' + essence.essence.name;
                    return <a href={whLink} data-wowhead={link}>{value}</a>;
                } else {
                    return '';
                }
            },
            characters = response.data,
            result = [];
        for (let i in characters) {
            let character = characters[i],
                essences = character.essences,
                spec = character.spec,
                items = character.items,
                neck = items.neck.azeriteItem,
                neckProgress = ((100 / neck.azeriteExperienceRemaining) * neck.azeriteExperience).toFixed(),
                neckText = items.neck ? neck.azeriteLevel + " +" + neckProgress + "%" : '',
                ilvl = items.averageItemLevelEquipped + '(' + items.averageItemLevel + ')',
                specImg = spec ? 'https://wow.zamimg.com/images/wow/icons/small/' + character.spec.icon + '.jpg' : '',
                row = {
                    name: character.name,
                    spec: spec ? <span><img src={specImg}/> {spec.name}</span> : '',
                    ilvl: ilvl,
                    neck: neckText,
                    activeEssence: getWhEssence(essences, 0),
                    passiveEssence1: getWhEssence(essences, 1),
                    passiveEssence2: getWhEssence(essences, 2),
                    head: getWhItem(items.head),
                    shoulder: getWhItem(items.shoulder),
                    back: getWhItem(items.back),
                    chest: getWhItem(items.chest),
                    wrist: getWhItem(items.wrist),
                    hands: getWhItem(items.hands),
                    waist: getWhItem(items.waist),
                    legs: getWhItem(items.legs),
                    feet: getWhItem(items.feet),
                    finger1: getWhItem(items.finger1),
                    finger2: getWhItem(items.finger2),
                    trinket1: getWhItem(items.trinket1),
                    trinket2: getWhItem(items.trinket2),
                    mainHand: getWhItem(items.mainHand),
                    offHand: getWhItem(items.offHand)
                };
            if (!items) console.log(character.name);
            result.push(row);
        }
        return result;
    },

    getGear = () => {
        return dispatch => {
            let onFetchSuccess = (result) => dispatch(fetchGearSuccess({
                    rows: result,
                    columns: columns
                })),
                onFetchError = (error) => dispatch(fetchGearError(error));
            fetchData('/rest/characters', onFetchSuccess, onFetchError);
            dispatch(fetchGearBegin({
                rows: [],
                columns: columns
            }));
        }
    },

    refreshGear = () => {
        return dispatch => {
            let onFetchSuccess = (result) => dispatch(fetchGearSuccess({
                    rows: result,
                    columns: columns
                })),
                onFetchError = (error) => dispatch(fetchGearError(error));
            fetchData('/rest/refresh/characters', onFetchSuccess, onFetchError, true);
            dispatch(fetchGearBegin({
                rows: [],
                columns: columns
            }));
        }
    },

    refreshCharacter = (index, name) => {
        return dispatch => {
            let onFetchSuccess = (result) => dispatch(refreshCharacterSuccess(result)),
                onFetchError = (error) => dispatch(refreshCharacterError(error));
            fetchData('/rest/refresh/characters/' + name, onFetchSuccess, onFetchError, true);
            dispatch(refreshCharacterBegin(index))
        }
    },

    fetchData = (link, onFetchSuccess, onFetchError, isPutRequest) => {
        (isPutRequest ? axios.put(link) : axios.get(link))
            .then(response => {
                let result = handleGearResponse(response);
                onFetchSuccess(result)
            })
            .catch((error) => {
                console.log(error);
                onFetchError(error);
            });
    },

    sortData = (data, column, sortDirection) => {
        return dispatch => {
            let {rows, columns} = data,
                columnField = columns[column].field,
                getElementValue = (e) => {
                    let v = e[columnField];
                    return React.isValidElement(v) ? v.props.children : v;
                },
                newData = {
                    rows: orderBy(rows, getElementValue, [sortDirection]),
                    columns: columns
                };
            dispatch(sortColumn(newData, columnField, sortDirection))
        }
    },

    // actions
    fetchGearBegin = (emptyData) => ({
        type: Types.FETCH_GEAR_BEGIN,
        payload: {emptyData: emptyData}
    }),

    fetchGearSuccess = (data) => ({
        type: Types.FETCH_GEAR_SUCCESS,
        payload: {data: data}
    }),

    fetchGearError = (error) => ({
        type: Types.FETCH_GEAR_ERROR,
        payload: {error: error}
    }),
    refreshCharacterBegin = (index) => ({
        type: Types.REFRESH_CHARACTER_BEGIN,
        payload: {index: index}
    }),

    refreshCharacterSuccess = (rows) => ({
        type: Types.REFRESH_CHARACTER_SUCCESS,
        payload: {rows: rows}
    }),

    refreshCharacterError = (error) => ({
        type: Types.REFRESH_CHARACTER_ERROR,
        payload: {error: error}
    }),

    sortColumn = (sortedData, columnToSort, sortDirection) => ({
        type: Types.SORT_COLUMN,
        payload: {
            data: sortedData,
            columnToSort: columnToSort,
            sortDirection: sortDirection
        }
    });

//export
export default {
    fetchGearBegin,
    fetchGearSuccess,
    fetchGearError,
    refreshCharacterBegin,
    refreshCharacterSuccess,
    refreshCharacterError,
    sortColumn,
    Types
};

export {getGear, sortData, refreshGear, refreshCharacter}