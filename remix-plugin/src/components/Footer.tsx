import React from 'react';

export const Footer = ({ isLoaded }) => (
    <footer className="footer">
        <span className="status" style={{ background: isLoaded ? 'var(--success)' : 'var(--danger)' }}></span>
        Zokrates: {isLoaded ? "Loaded" : "Loading..." }
    </footer>
);