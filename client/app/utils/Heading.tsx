import React, { FC } from "react";

// created utils folder

// first file created and imported into page component

interface HeadProps {
    title: string;
    description: string
    keywords: string
}


const Heading: FC<HeadProps> = ({
    title, description, keywords
}) => {
    return (
        <>
            <title>{title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
        </>
    )
}

export default Heading