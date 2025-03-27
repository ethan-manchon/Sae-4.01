import React from 'react';

interface ErrorProps {
    error: string;
}

export default function Error({ error }: ErrorProps) {
    return (
    <div className="bg-error-bg border border-error-border text-error px-4 py-3 rounded relative mt-2" role="alert">
        <span className="block sm:inline">{error}</span>
    </div>
    );
}