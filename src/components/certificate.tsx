import { Card, CardContent, CardMenu } from '../components/card';
import {
    CertificateTable,
    columns,
    defaultColumns
} from '../tables/certificate';
import {
    useAddCertificate,
    useCertificate,
    useCertificateTypes
} from '../api/hooks/useCertificate';

import { CertificateModal } from '../modal/certificate';
import { SertifikatType } from '../contracts/certificateApi';
import { TableContainer } from '../tables/tableContainer';
import { User } from '../contracts/userApi';
import { useState } from 'react';

interface CertificateListProps {
    user: User | undefined;
}
export const CertificateList = ({ user }: CertificateListProps) => {
    const [addNew, setAddNew] = useState<boolean>(false);

    const certificateData = useCertificate({ userId: user?.id });

    const certificateTypeData = useCertificateTypes();

    const certificateMutation = useAddCertificate();

    async function handleSubmit(
        number: string,
        type: SertifikatType,
        validTo: string
    ): Promise<boolean> {
        try {
            if (user) {
                await certificateMutation.mutateAsync({
                    number,
                    typeId: type.id,
                    userId: user.id,
                    validTo
                });
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setAddNew(false);
            return true;
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
                    <TableContainer
                        columns={columns()}
                        defaultColumns={defaultColumns}
                        tableId="certificates">
                        <CertificateTable
                            certificates={certificateData.data ?? []}
                            isLoading={certificateData.isLoading}
                        />
                    </TableContainer>
                </CardContent>
            </Card>
            <CertificateModal
                handleSubmit={handleSubmit}
                certificateTypes={certificateTypeData.data}
                isOpen={addNew}
                close={() => setAddNew(false)}
            />
        </>
    );
};
