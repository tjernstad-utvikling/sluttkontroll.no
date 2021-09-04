import {
    TemplateTable,
    columns,
    defaultColumns
} from '../tables/skjemaTemplate';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import { TableContainer } from '../tables/tableContainer';
import { Template } from '../contracts/skjemaTemplateApi';
import Typography from '@material-ui/core/Typography';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useTemplate } from '../data/skjemaTemplate';

interface SelectTemplateProps {
    onSelect: (template: Template) => void;
    onOpen: () => void;
    isOpen: boolean;
}
export const SelectTemplate = ({
    onSelect,
    onOpen,
    isOpen
}: SelectTemplateProps) => {
    const classes = useStyles();
    const {
        state: { templates },
        loadTemplates
    } = useTemplate();
    useEffectOnce(async () => {
        loadTemplates();
    });
    return (
        <div className={classes.wrapper}>
            <Button
                type="button"
                fullWidth
                variant="outlined"
                color="primary"
                onClick={onOpen}>
                Velg fra maler
            </Button>
            {templates !== undefined && isOpen ? (
                <>
                    <Typography>Sjekkliste maler</Typography>
                    <TableContainer
                        columns={columns({
                            path: '',
                            deleteTemplate: () => console.log('')
                        })}
                        defaultColumns={defaultColumns}
                        tableId="skjemaTemplates">
                        <TemplateTable templates={templates} />
                    </TableContainer>
                </>
            ) : (
                <div>Laster maler</div>
            )}
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapper: {
            margin: theme.spacing(1)
        }
    })
);
