import { Card, CardContent } from '../components/card';
import {
    CertificateTable,
    columns,
    defaultColumns
} from '../tables/certificate';
import { useEffect, useState } from 'react';

import { Sertifikat } from '../contracts/certificateApi';
import { TableContainer } from '../tables/tableContainer';
import { User } from '../contracts/userApi';
import { errorHandler } from '../tools/errorHandler';
import { getSertifikatByUser } from '../api/certificateApi';
import { useSnackbar } from 'notistack';

interface CertificateListProps {
    user: User | undefined;
}
export const CertificateList = ({ user }: CertificateListProps) => {
    const [certificates, setCertificates] = useState<Sertifikat[]>();

    const { enqueueSnackbar } = useSnackbar();

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
    });
    return (
        <Card title="Sertifikater">
            <CardContent>
                {certificates !== undefined ? (
                    <TableContainer
                        columns={columns()}
                        defaultColumns={defaultColumns}
                        tableId="certificates">
                        <CertificateTable certificates={certificates ?? []} />
                    </TableContainer>
                ) : (
                    <div>Laster Sertifikater</div>
                )}
            </CardContent>
        </Card>
    );
};
