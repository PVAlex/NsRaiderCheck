import React from 'react'

import {connect} from "react-redux";
import {getGear, sortData, refreshGear, refreshCharacter} from "../actions/gearTableActions";
import {
    Cell,
    Column,
    ColumnHeaderCell,
    Table,
    SelectionModes,
    RegionCardinality
} from "@blueprintjs/table"
import {Menu, MenuDivider, MenuItem} from "@blueprintjs/core";

class CustomizableTable extends React.Component {

    componentDidMount() {
        this.props.getGear();
    }

    columnsRenderer = (data) => {
        let {rows, columns} = data,
            {loading, sortColumn, loadingRow} = this.props;
        return columns.map((column, index) => {
            const cellRenderer = (rowIndex) =>
                    <Cell style={{fontSize: '16px'}} loading={loadingRow === rowIndex || loading}>
                        {loading ? '' : rows[rowIndex][column.field]}
                    </Cell>,
                sortMenuRenderer = (index) => {
                    const sortAsc = () => sortColumn(data, index, 'asc'),
                          sortDesc = () => sortColumn(data, index, 'desc');
                    return (
                        <Menu>
                            <MenuItem icon="sort-asc" onClick={sortAsc} text="Сортировать по возрастанию"/>
                            <MenuItem icon="sort-desc" onClick={sortDesc} text="Сортировать по убыванию"/>
                        </Menu>
                    );
                },
                columnHeaderCellRenderer = () =>
                    <ColumnHeaderCell menuRenderer={sortMenuRenderer} name={column.label}/>;
            return <Column
                cellRenderer={cellRenderer}
                columnHeaderCellRenderer={columnHeaderCellRenderer}
                key={index}
                name={column.label}
            />
        })
    };

    bodyContextMenuRenderer = (context) => {
        let index = context.target.rows[0],
            { data, loadingRow, loading } = this.props,
            name = data.rows.length > 0 ? data.rows[index].name : '';
        return <Menu>
            <MenuDivider title={name}/>
            <MenuItem text='Обновить' icon='refresh' onClick={() => this.props.refreshCharacter(index, name)} disabled={ loadingRow || loading }/>
            <MenuDivider/>
            <MenuItem text='Обновить всех' icon='refresh' onClick={this.props.refreshAll} disabled={ loadingRow || loading }/>
        </Menu>
    };

    render() {
        let {data, loading, error} = this.props;
        return (
            <Table
                bodyContextMenuRenderer={this.bodyContextMenuRenderer}
                numFrozenColumns={1}
                defaultRowHeight={30}
                enableRowHeader={true}
                enableRowResizing={false}
                numRows={loading ? 35 : data.rows.length}
                selectionModes={[SelectionModes.ROWS_AND_CELLS, RegionCardinality.FULL_ROWS, RegionCardinality.CELLS]}
            >
                {this.columnsRenderer(data, loading)}
            </Table>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getGear: () => dispatch(getGear()),
    sortColumn: (data, column, sortDirection) => dispatch(sortData(data, column, sortDirection)),
    refreshAll: () => dispatch(refreshGear()),
    refreshCharacter: (index, name) => dispatch(refreshCharacter(index, name))
});

const mapStateToProps = state => ({
    data: state.gearTable.data,
    loading: state.gearTable.loading,
    loadingRow: state.gearTable.loadingRow,
    error: state.gearTable.error
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomizableTable)