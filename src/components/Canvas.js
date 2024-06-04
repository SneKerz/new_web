import React, { useEffect, useRef, useState } from "react";
import "./canvas.css"; // Ensure this CSS file contains any necessary styles
import HoverBox from "./HoverBox";

const Canvas = ({ color, userPublicKey, canvasWidth = 1000, canvasHeight = 1000, previewImage, previewPlacement, scale, onPlace }) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const ws = useRef(null);
  const pixelSize = 10;
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const pixelData = useRef(initializePixelData(canvasWidth / pixelSize, canvasHeight / pixelSize));
  const [isPainting, setIsPainting] = useState(false);
  const [availablePixels, setAvailablePixels] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [hoverDetails, setHoverDetails] = useState({
    isVisible: false,
    details: { color: '', userId: '', timestamp: '', link: '' },
    position: { x: 0, y: 0 },
  });
  const hoverTimeout = useRef(null);
  const [defaultLink, setDefaultLink] = useState(null);

  function initializePixelData(width, height) {
    const data = new Array(height);
    for (let i = 0; i < height; i++) {
      data[i] = new Array(width).fill(null);
    }
    return data;
  }

  const [isHoveringHoverBox, setIsHoveringHoverBox] = useState(false);

const handleHoverBoxMouseEnter = () => {
  setIsHoveringHoverBox(true);
};

const handleHoverBoxMouseLeave = () => {
  setIsHoveringHoverBox(false);
  setHoverDetails({ ...hoverDetails, isVisible: false });
};

  useEffect(() => {
    ws.current = new WebSocket(`wss://server1.thepixelwall.art:3000`);

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.action === 'updatePixelCount' && message.userId === userPublicKey) {
          setAvailablePixels(message.availablePixels);
      } else if (message.x !== undefined && message.y !== undefined) {
          updatePixelData(message.x, message.y, message.color, message.userId, message.timestamp, message.link, message.contractAddress, message.twitterLink, message.telegramLink, message.showPreview);
      }
  };
  
  

    return () => {
      ws.current.close();
    };
  }, [userPublicKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    setCtx(canvas.getContext("2d"));

    return () => {
      // Cleanup code here if needed
    };
  }, []);

  const redrawCanvas = () => {
    if (ctx) {
      // Iterate over pixelData and draw each pixel
      for (let y = 0; y < pixelData.current.length; y++) {
        for (let x = 0; x < pixelData.current[y].length; x++) {
          const pixel = pixelData.current[y][x];
          if (pixel) {
            drawPixel(x, y, pixel.color);
          }
        }
      }
    }
  };



  const applyTransformations = () => {
    if (ctx) {
      ctx.save();
      ctx.fillStyle = isPanning ? 'gray' : 'white'; // Set the background to gray when panning
      ctx.fillRect(-offset.x / zoomLevel, -offset.y / zoomLevel, canvasRef.current.width / zoomLevel, canvasRef.current.height / zoomLevel);
      ctx.restore();
      ctx.setTransform(zoomLevel, 0, 0, zoomLevel, offset.x, offset.y);
      redrawCanvas();
    }
  };
  useEffect(() => {
    if (previewImage && previewPlacement && ctx) {
      const image = new Image();
      image.onload = () => {
        // Clear the preview area to avoid overlaying previews
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        redrawCanvas();  // Redraw existing canvas content
  
        // Calculate scaled dimensions
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
  
        // Align position to the grid
        const alignedX = Math.round(previewPlacement.x / 10) * 10;
        const alignedY = Math.round(previewPlacement.y / 10) * 10;
  
        // Draw the preview image scaled and aligned
        ctx.drawImage(image, alignedX, alignedY, scaledWidth, scaledHeight);
      };
      image.src = previewImage;
    }
  }, [previewImage, previewPlacement, scale, ctx, redrawCanvas]);
  
  
  

  
  useEffect(() => {
    applyTransformations();
  }, [zoomLevel, offset]);

  const updatePixelData = (x, y, color, userId, timestamp, link, contractAddress, twitterLink, telegramLink, showPreview) => {
    pixelData.current[y][x] = { color, userId, timestamp, link, contractAddress, twitterLink, telegramLink, showPreview };
    drawPixel(x, y, color);
};



  const drawPixel = (x, y, color) => {
    if (ctx) {
      const scaledX = x * pixelSize;
      const scaledY = y * pixelSize;
      const scaledSize = pixelSize;
      ctx.fillStyle = color;
      ctx.fillRect(scaledX, scaledY, scaledSize, scaledSize);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();  // This will prevent the page from scrolling when the mouse wheel is used over the canvas
    const newZoomLevel = e.deltaY < 0 ? Math.min(5, zoomLevel * 1.1) : Math.max(1, zoomLevel / 1.1);
    setZoomLevel(newZoomLevel);
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsPainting(true);
    } else if (e.button === 2) {
      setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      setIsPanning(true);
      setShowOverlay(true); // Show the overlay when panning starts
    }
  };

  const handleMouseMove = async (e) => {
    if (isPanning) {
      const newX = e.clientX - startPan.x;
      const newY = e.clientY - startPan.y;
      setOffset({ x: newX, y: newY });
      return;
    }
  
    if (isHoveringHoverBox) {
      // Prevent hover box from disappearing when hovering over it
      return;
    }
  
    // Clear any existing hover timeout
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
  
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - offset.x) / (pixelSize * zoomLevel));
    const y = Math.floor((e.clientY - rect.top - offset.y) / (pixelSize * zoomLevel));
  
    // Set a timeout to display the hover box after 1 second
    hoverTimeout.current = setTimeout(() => {
      if (x >= 0 && x < canvasWidth / pixelSize && y >= 0 && y < canvasHeight / pixelSize) {
        const pixel = pixelData.current[y][x];
        if (pixel) {
          setHoverDetails({
            isVisible: true,
            details: { ...pixel },
            position: { x: e.clientX, y: e.clientY },
          });
        }
      }
    }, 1000);
  };
  
  
  
  const handlePlaceImage = () => {
    const image = new Image();
    image.onload = () => {
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      const alignedX = Math.round(previewPlacement.x / 10) * 10;
      const alignedY = Math.round(previewPlacement.y / 10) * 10;
  
      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d');
      offscreenCanvas.width = scaledWidth;
      offscreenCanvas.height = scaledHeight;
      offscreenCtx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
  
      for (let y = 0; y < scaledHeight; y += 10) {
        for (let x = 0; x < scaledWidth; x += 10) {
          const pixelData = offscreenCtx.getImageData(x, y, 1, 1).data;
          const canvasX = alignedX + x;
          const canvasY = alignedY + y;
  
          ctx.fillStyle = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
          ctx.fillRect(canvasX, canvasY, 10, 10);
          updatePixelData(canvasX / 10, canvasY / 10, `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`);
        }
      }
    };
    image.src = previewImage;
  };
  
  const handleMouseUp = () => {
    setIsPainting(false);
    setIsPanning(false);
    setShowOverlay(false); // Hide the overlay when panning stops
  };

  const paintPixel = async (e) => {
    if (!userPublicKey || !isPainting || availablePixels <= 0) return;

    const defaultLink = await fetchDefaultLink(); // Fetch the default link here

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - offset.x) / (pixelSize * zoomLevel));
    const y = Math.floor((e.clientY - rect.top - offset.y) / (pixelSize * zoomLevel));

    if (x >= 0 && x < canvasWidth / pixelSize && y >= 0 && y < canvasHeight / pixelSize) {
      updatePixelData(x, y, color, userPublicKey, new Date().toISOString(), defaultLink);

      if (ws.current) {
        ws.current.send(JSON.stringify({
          action: "placePixel",
          x,
          y,
          color,
          userId: userPublicKey,
          link: defaultLink // Include the link here
        }));

        // Decrement the available pixels only after a successful backend update.
        setAvailablePixels((prev) => Math.max(0, prev - 1));
      }
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setIsPanning(false);
    setShowOverlay(false);
    setHoverDetails({ ...hoverDetails, isVisible: false });
    document.body.style.overflow = "auto"; // Reset scrolling on the body when the mouse leaves the canvas
  };

  const fetchDefaultLink = async () => {
    if (!userPublicKey) return;
  
    try {
      const response = await fetch(`https://server1.thepixelwall.art:3000/user-default-link/${userPublicKey}`);
      if (!response.ok) {
        throw new Error('Failed to fetch default link');
      }
      const data = await response.json();
      setDefaultLink(data.defaultLink); // Update the state here
    } catch (error) {
      console.error('Error fetching default link:', error);
    }
  };
  
  const handleClick = async (e) => {
    // Check if the hover box is visible and the click is within its boundaries
    if (hoverDetails.isVisible) {
      const hoverBoxRect = document.querySelector('.hover-box').getBoundingClientRect();
      if (e.clientX >= hoverBoxRect.left && e.clientX <= hoverBoxRect.right &&
          e.clientY >= hoverBoxRect.top && e.clientY <= hoverBoxRect.bottom) {
        // Click is inside the hover box, don't place a pixel
        return;
      }
    }
  
    // Proceed with pixel placement only if the user has connected their wallet
    if (!userPublicKey) {
      alert("You need to connect your wallet to place a pixel.");
      return;
    }
  
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - offset.x) / (pixelSize * zoomLevel));
    const y = Math.floor((e.clientY - rect.top - offset.y) / (pixelSize * zoomLevel));
  
    if (x >= 0 && x < canvasWidth / pixelSize && y >= 0 && y < canvasHeight / pixelSize) {
      const response = await fetch(`https://server1.thepixelwall.art:3000/user-info/${userPublicKey}`);
      if (response.ok) {
        const userData = await response.json();
        updatePixelData(x, y, color, userPublicKey, new Date().toISOString(), userData.defaultLink, userData.contractAddress, userData.twitterLink, userData.telegramLink, userData.showPreview);
  
        if (ws.current) {
          ws.current.send(JSON.stringify({
            action: "placePixel",
            x,
            y,
            color,
            userId: userPublicKey,
            link: userData.defaultLink,
            contractAddress: userData.contractAddress,
            twitterLink: userData.twitterLink,
            telegramLink: userData.telegramLink,
            showPreview: userData.showPreview,
          }));
  
          setAvailablePixels((prev) => Math.max(0, prev - 1));
        }
      } else {
        console.error(`Failed to fetch user data: ${response.status}`);
      }
    }
  };
  
  
  
  
  
  

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartPan({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    setIsPanning(true);
  };

  const handleTouchMove = (e) => {
    if (isPanning) {
      const touch = e.touches[0];
      const newX = touch.clientX - startPan.x;
      const newY = touch.clientY - startPan.y;
      setOffset({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };


  const handleCanvasEnter = () => {
    document.body.style.overflow = "hidden";
  };

  const handleCanvasLeave = () => {
    document.body.style.overflow = "auto";
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleCanvasEnter} // Added onMouseEnter event
        onMouseLeave={handleMouseLeave} // Updated to use handleMouseLeave
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={handleContextMenu}
        style={{ border: "2px solid #7C3AED", cursor: "pointer", userSelect: "none" }}
      ></canvas>
<HoverBox
  isVisible={hoverDetails.isVisible}
  details={hoverDetails.details}
  position={hoverDetails.position}
  onMouseEnter={handleHoverBoxMouseEnter}
  onMouseLeave={handleHoverBoxMouseLeave}
/>

    </>
  );
};

export default Canvas;
