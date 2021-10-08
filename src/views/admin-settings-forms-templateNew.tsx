import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import { FormsTemplateGroupSchema } from '../schema/formsTemplateGroup';
import { FormsTemplateSchema } from '../schema/formsTemplate';
import Grid from '@material-ui/core/Grid';
import { usePageStyles } from '../styles/kontroll/page';

const FormsTemplateNewView = () => {
    const classes = usePageStyles();

    const onSave = async (
        title: string,
        subTitle: string,
        description: string
    ) => {
        return false;
    };
    const onSaveGroup = async (title: string, description: string) => {
        return false;
    };
    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Ny skjema mal">
                            <FormsTemplateSchema onSubmit={onSave} />
                        </Card>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Grupper">
                            <FormsTemplateGroupSchema onSubmit={onSaveGroup} />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default FormsTemplateNewView;
