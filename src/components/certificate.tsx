import { Card, CardContent, CardMenu } from '../components/card';
import {
    CertificateTable,
    columns,
    defaultColumns
} from '../tables/certificate';
import { Sertifikat, SertifikatType } from '../contracts/certificateApi';
import { getSertifikatByUser, getSertifikatTypes } from '../api/certificateApi';
import { useEffect, useState } from 'react';

import { CertificateModal } from '../modal/certificate';
import { TableContainer } from '../tables/tableContainer';
import { User } from '../contracts/userApi';
import { errorHandler } from '../tools/errorHandler';
import { useSnackbar } from 'notistack';

interface CertificateListProps {
    user: User | undefined;
}
export const CertificateList = ({ user }: CertificateListProps) => {
    const [certificates, setCertificates] = useState<Sertifikat[]>();
    const [certificateTypes, setCertificateTypes] =
        useState<SertifikatType[]>();

    const [addNew, setAddNew] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        let isActive = true;
        async function get() {
            try {
                if (certificateTypes === undefined) {
                    const { status, certificateTypes } =
                        await getSertifikatTypes();
                    if (status === 200 && isActive) {
                        setCertificateTypes(certificateTypes);
                    }
                }
            } catch (error) {
                errorHandler(error);
                enqueueSnackbar('Kan ikke laste sertifikater', {
                    variant: 'error'
                });
            }
        }
        get();
        return () => {
            isActive = false;
        };
    }, [certificateTypes, enqueueSnackbar]);

    useEffect(() => {
        let isActive = true;
        async function get() {
            try {
                if (user) {
                    const { status, certificates } = await getSertifikatByUser(
                        user
                    );
                    if (status === 200 && isActive) {
                        setCertificates(certificates);
                    }
                }
            } catch (error) {
                errorHandler(error);
                enqueueSnackbar('Kan ikke laste sertifikater', {
                    variant: 'error'
                });
            }
        }
        get();
        return () => {
            isActive = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    return (
        <>
            <Card
                title="Sertifikater"
                menu={
                    <CardMenu
                        items={[
                            {
                                label: 'Nytt sertifikat',
                                action: () => setAddNew(!addNew)
                            }
                        ]}
                    />
                }>
                <CardContent>
                    {certificates !== undefined ? (
                        <TableContainer
                            columns={columns()}
                            defaultColumns={defaultColumns}
                            tableId="certificates">
                            <CertificateTable
                                certificates={certificates ?? []}
                            />
                        </TableContainer>
                    ) : (
                        <div>Laster Sertifikater</div>
                    )}
                </CardContent>
            </Card>
            <CertificateModal
                certificateTypes={certificateTypes}
                isOpen={addNew}
                close={() => setAddNew(false)}
            />
        </>
    );
};
