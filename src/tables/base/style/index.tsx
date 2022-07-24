import { makeStyles } from '../../../theme/makeStyles';

export const useTableStyles = makeStyles<void, 'columnAction'>()(
    (_theme, _params, classes) => ({
        header: {
            [`&:hover .${classes.columnAction}`]: {
                color: 'red'
            }
        },
        columnAction: {
            color: 'transparent'
        },
        canSortClass: {
            cursor: 'pointer',
            userSelect: 'none'
        }
    })
);
