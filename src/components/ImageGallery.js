import React, { useState } from 'react';
import { Window, WindowContent, WindowHeader, Button, Toolbar } from '@react95/core';
import styled from 'styled-components';

const StyledImage = styled.img`
  width: 100%;
  max-width: 200px;
  margin: 10px;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const GalleryWindow = styled(Window)`
  max-width: 640px;
  margin: 20px auto;
`;

function ImageGallery({ images }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <GalleryWindow>
      <WindowHeader>
        <span>ImageGallery</span>
        <Button onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </WindowHeader>
      <Toolbar>
        <Button fullWidth>
          Save
        </Button>
      </Toolbar>
      <WindowContent>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {images.map((image, index) => (
            <StyledImage key={index} src={image.src} alt={image.alt} />
          ))}
        </div>
      </WindowContent>
    </GalleryWindow>
  );
}

export default ImageGallery;
