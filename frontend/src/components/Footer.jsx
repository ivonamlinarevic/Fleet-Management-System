import React from 'react';
import { FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-icons">
        <a href="https://github.com/ivonamlinarevic" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub size={20} />
        </a>
        <a href="mailto:imlina00@fesb.hr" aria-label="Email">
          <FaEnvelope size={20} />
        </a>
      </div>
      <p>© 2025 Ivona Mlinarević. Sva prava pridržana.</p>
    </footer>
  );
};

export default Footer;
