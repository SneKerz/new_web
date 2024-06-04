import React from 'react';
import styled from 'styled-components';



const Title = styled.h2`
    color: #333;
`;

const Text = styled.p`
    color: #666;
    font-size: 16px;
`;

const Image = styled.img`
    width: 100%;  // Adjust the width as needed
    height: auto;
    margin-top: 10px;
    display: block; // Ensure images don't appear inline
`;

function ContactTest({ content }) {
    const { title, description, imageUrls } = content;

    return (
        <div>
            <Title>{title}</Title>
            <Text>{description}</Text>
            {imageUrls && imageUrls.map((url, index) => (
                <Image key={index} src={url} alt={`Descriptive Caption ${index + 1}`} />
            ))}
            </div>
    );
}

export default ContactTest;
