import React from 'react';
import VideogamePopup from './VideogamePopup';

interface FantasmaPopupProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
}

const FantasmaPopup2: React.FC<FantasmaPopupProps> = ({ isVisible, onClose, title }) => {
  return (
    <VideogamePopup isVisible={isVisible} onClose={onClose} title={title} theme="red" />
  );
};

export default FantasmaPopup2;

