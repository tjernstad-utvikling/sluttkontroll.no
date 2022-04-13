import {
    TemplateTable,
    columns,
    defaultColumns
} from '../tables/skjemaTemplate';

import Button from '@mui/material/Button';
import { TableContainer } from '../tables/tableContainer';
import { Template } from '../contracts/skjemaTemplateApi';
import { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { makeStyles } from '../theme/makeStyles';
import { useTemplates } from '../api/hooks/useSkjemaTemplate';

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
    const { classes } = useStyles();

    const templateData = useTemplates();

    const onSelectTemplate = (templateId: number) => {
        const template = templateData.data?.find((t) => t.id === templateId);
        if (template !== undefined) {
            onSelect(template);
        }
    };
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
            {isOpen && (
                <>
                    <Typography component="h3" variant="h4">
                        Sjekkliste maler
                    </Typography>

                    <TableContainer
                        columns={columns({
                            selectTemplate: true,
                            onSelectTemplate
                        })}
                        defaultColumns={defaultColumns}
                        tableId="skjemaTemplates">
                        <TemplateTable
                            isLoading={templateData.isLoading}
                            templates={templateData.data ?? []}
                        />
                    </TableContainer>
                </>
            )}
        </div>
    );
};

const useStyles = makeStyles()((theme: Theme) => ({
    wrapper: {
        margin: theme.spacing(1)
    }
}));
