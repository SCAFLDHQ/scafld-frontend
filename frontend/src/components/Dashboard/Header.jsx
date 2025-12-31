import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 whitespace-nowrap border-b border-solid border-b-[#40214a] px-2 sm:px-4 md:px-6 lg:px-10 py-3">
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        <div className="flex items-center gap-3 sm:gap-4 text-white">
          <div className="size-6 text-primary flex-shrink-0">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
            </svg>
          </div>
          <Link to='/'>
          <h2 className="text-white text-lg sm:text-xl font-bold leading-tight tracking-[-0.015em]">
            SCAFLD
          </h2>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="sm:hidden p-2 rounded-lg bg-[#40214a]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined text-white text-lg">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Search Bar - Hidden on mobile, visible on sm+ */}
      <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-80 w-full sm:w-auto mx-4">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
          <div className="text-[#bd8ecc] flex border-none bg-[#40214a] items-center justify-center pl-3 sm:pl-4 rounded-l-lg border-r-0">
            <span className="material-symbols-outlined text-lg">search</span>
          </div>
          <input 
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#40214a] focus:border-none h-full placeholder:text-[#bd8ecc] px-3 sm:px-4 rounded-l-none border-l-0 pl-2 text-sm sm:text-base font-normal leading-normal" 
            placeholder="Search" 
          />
        </div>
      </label>

      {/* Desktop Navigation & Profile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 sm:gap-4 w-full sm:w-auto">
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden flex flex-col gap-3 w-full pb-4 border-b border-[#40214a]">
            <a className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors py-2" href="#">
              Projects
            </a>
            <a className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors py-2" href="#">
              Templates
            </a>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-4">
          <a className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">
            Projects
          </a>
          <a className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">
            Templates
          </a>
        </div>

        {/* Profile Avatar */}
        <Link to='/profile'>
        <div 
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 sm:size-10 ml-auto sm:ml-0" 
          style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2txiC5Wiq5iEXS4Myi2-XbvMnBX4qkRNR2ZyWriUptoWnoTjCZ528ceZXUVcA6uR591nLOUNYDwJT3yuYSF238LEaiU8pj_zB2W-meE7bRv8v2InbcY68Ok2GuZyS1NyrTT7fpS6-95wz5PsRqnqcbzbjQdE6XK3qdPpyi7pdxoSR7F0DUYTWlGfsEgqp5v6WKrRpCPxLtHfD_f7TTUqrdhSXaZSmS86yy9KNMHpgE9h7E7VXB1kFRETnq-XXCkz6_EhlgCENVdwi")'}}
        ></div>
        </Link>
      </div>
    </header>
  );
};

export default Header;