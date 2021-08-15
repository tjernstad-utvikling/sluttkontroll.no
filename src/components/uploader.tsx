import BackupIcon from '@material-ui/icons/Backup';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
interface DropZoneProps {
    accept: 'image/png, image/jpeg' | 'image/*';
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    children?: React.ReactNode;
}
export function DropZone({ accept, setFiles, children }: DropZoneProps) {
    const classes = useStyles();
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept,
        onDrop: (acceptedFiles) => {
            setFiles((prev) => [...prev, ...acceptedFiles]);
        }
    });

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
                    Dra og slipp filer her, eller klikk og velg
                </Button>
            </div>
            <aside>{children}</aside>
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
