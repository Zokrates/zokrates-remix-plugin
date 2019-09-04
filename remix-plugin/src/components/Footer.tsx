import React from 'react';

type FooterProps = {
    isLoading: boolean
}

export const Footer: React.FC<FooterProps> = (props: FooterProps) => {

    return (
        <footer className="footer">
            <span className="status" style={{ background: props.isLoading ? 'var(--danger)' : 'var(--success)' }}></span>
            Zokrates: {props.isLoading ? "Loading..." : "Loaded"}
        </footer>
    );
}