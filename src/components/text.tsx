export const VisuallyHidden = ({
    children,
    id
}: {
    children: React.ReactNode;
    id: string;
}) => {
    return (
        <span
            id={id}
            style={{
                left: '-9999px',
                position: 'absolute'
            }}>
            {children}
        </span>
    );
};
