import React from 'react';
import './HoverBox.css';

const HoverBox = ({ isVisible, details, position }) => {
  if (!isVisible || !details.link) {
    return null;
  }


  // Constants for hover box size
  const hoverBoxWidth = 800;
  const hoverBoxHeight = 500;

  // Calculate available space around the cursor
  const spaceRight = window.innerWidth - position.x;
  const spaceLeft = position.x;
  const spaceTop = position.y;
  const spaceBottom = window.innerHeight - position.y;

  // Decide where to place the hover box based on available space
  const style = {
    left: spaceRight >= hoverBoxWidth || spaceRight >= spaceLeft ? `${position.x}px` : `${position.x - hoverBoxWidth}px`,
    top: spaceBottom >= hoverBoxHeight || spaceBottom >= spaceTop ? `${position.y}px` : `${position.y - hoverBoxHeight}px`,
    width: `${hoverBoxWidth}px`,
    height: `${hoverBoxHeight}px`,
    position: 'absolute',
    display: isVisible ? 'block' : 'none',
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? 'all' : 'none',
  };

  return (
    <div className="hover-box" style={style}>
      {details.link && (
        <div className="preview">
          <iframe src={details.link} width="800" height="400" title="Preview"></iframe>
        </div>
      )}
      <div className="details">
      <p className="contract-address">CA: {details.contractAddress}</p>
          {details.twitterLink && (
            <a href={details.twitterLink} target="_blank" rel="noopener noreferrer" className="twitter-logo">Twitter: {details.telegramLink}</a>
          )}
          <br/>
          {details.telegramLink && (
            <a href={details.telegramLink} target="_blank" rel="noopener noreferrer" className="telegram-logo">Telegram: {details.telegramLink}</a>
          )}
      </div>
    </div>
  );
};

export default HoverBox;
