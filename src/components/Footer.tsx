import React from 'react';

export const Footer = ({ isLoaded }) => (
    <footer className="footer">
        <div className="container">
            <span className="status ml-1" style={{ background: isLoaded ? 'var(--success)' : 'var(--danger)' }}></span>
            <span className="ml-2">ZoKrates: {isLoaded ? "Loaded" : "Loading..." }</span>
        </div>
    </footer>
);