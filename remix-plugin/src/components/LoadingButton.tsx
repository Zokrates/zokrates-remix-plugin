import React from 'react';
import { Button, ButtonProps, Spinner } from 'react-bootstrap';

export type LoadingButtonProps = {
    defaultText: string,
    loadingText?: string,
    isLoading: boolean;
    iconClassName: string,
} & ButtonProps & React.DOMAttributes<HTMLButtonElement>;

export const LoadingButton: React.FC<LoadingButtonProps> = (props) => {

    return (
        <Button {...props }>
            {(() => {
                if (props.isLoading) {
                    return (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            <span className="ml-2">{props.loadingText || props.defaultText}</span>
                        </>
                    );
                }
                return (
                    <>
                        <i className={props.iconClassName} aria-hidden="true"></i>
                        <span className="ml-2">{props.defaultText}</span>
                    </>
                );
            })()}
        </Button>
    );
}