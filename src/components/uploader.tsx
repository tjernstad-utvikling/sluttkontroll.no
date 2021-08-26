import BackupIcon from '@material-ui/icons/Backup';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';

interface DropZoneProps {
    accept: 'image/png, image/jpeg' | 'image/*' | 'application/pdf';
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    children?: React.ReactNode;
    files: File[];
    multiple?: boolean;
}
export function DropZone({
    accept,
    setFiles,
    children,
    files,
    multiple = false
}: DropZoneProps) {
    const classes = useStyles();

    function duplicateFileValidator(file: File) {
        const simFile = files.filter((f) => f.name === file.name);
        if (simFile.length > 0) {
            return {
                code: 'duplicate-name',
                message: 'Fil er allerede lagt til.'
            };
        }

        return null;
    }
    const {
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        multiple,
        accept,
        onDrop: (acceptedFiles) => {
            if (multiple) {
                setFiles((prev) => [...prev, ...acceptedFiles]);
            } else {
                setFiles(acceptedFiles);
            }
        },
        validator: duplicateFileValidator
    });

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.name}>
            {file.name} - {file.size} bytes
            <ul>
                {errors.map((e) => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    return (
        <section className="container">
            <div
                {...getRootProps({
                    className: clsx(classes.base, {
                        [classes.activeStyle]: isDragActive,
                        [classes.acceptStyle]: isDragAccept,
                        [classes.rejectStyle]: isDragReject
                    })
                })}>
                <input {...getInputProps()} />
                <Button color="primary" startIcon={<BackupIcon />}>
                    Dra og slipp fil(er) her, eller klikk og velg
                </Button>
            </div>
            <aside>
                {fileRejections.length > 0 && (
                    <>
                        <h4>Rejected files</h4>
                        <ul>{fileRejectionItems}</ul>
                    </>
                )}
                {children}
            </aside>
        </section>
    );
}

const useStyles = makeStyles({
    base: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out'
    },
    activeStyle: {
        borderColor: '#2196f3'
    },
    acceptStyle: {
        borderColor: '#00e676'
    },
    rejectStyle: {
        borderColor: '#ff1744'
    }
});
