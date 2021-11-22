import { Card, CardContent, CardMenu } from '../components/card';
import {
    CertificateTable,
    columns,
    defaultColumns
} from '../tables/certificate';
import { Sertifikat, SertifikatType } from '../contracts/certificateApi';
import {
    getSertifikatByUser,
    getSertifikatTypes,
    saveNewSertifikat
} from '../api/certificateApi';
import { useEffect, useState } from 'react';

import { CertificateModal } from '../modal/certificate';
import { TableContainer } from '../tables/tableContainer';
import { User } from '../contracts/userApi';
import { errorHandler } from '../tools/errorHandler';
import { useSnackbar } from 'notistack';

interface CertificateListProps {
    user: User | undefined;
    addCertificate: (certificate: Sertifikat) => void;
}
export const CertificateList = ({
    user,
    addCertificate
}: CertificateListProps) => {
    const [certificates, setCertificates] = useState<Sertifikat[]>([]);
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

    async function handleSubmit(
        number: string,
        type: SertifikatType,
        validTo: string
    ): Promise<boolean> {
        try {
            if (user) {
                const { status, certificate } = await saveNewSertifikat(
                    number,
                    type.id,
                    validTo,
                    user.id
                );
                if (status === 200) {
                    addCertificate(certificate);
                    setCertificates((prev) => [...prev, certificate]);

                    enqueueSnackbar('Sertifikat lagret', {
                        variant: 'success'
                    });
                    setAddNew(false);
                    return true;
                }
                if (status === 400 || status === 404) {
                    enqueueSnackbar(
                        'Det mangler opplysninger for lagring, sjekk at alle felter er fylt ut',
                        {
                            variant: 'success'
                        }
                    );
                }
            }
            return false;
        } catch (error) {
            errorHandler(error);
            enqueueSnackbar('Kan ikke lagre nytt sertifikat', {
                variant: 'error'
            });
            return false;
        }
    }

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
                handleSubmit={handleSubmit}
                certificateTypes={certificateTypes}
                isOpen={addNew}
                close={() => setAddNew(false)}
            />
        </>
    );
};
