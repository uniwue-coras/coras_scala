import { useState } from 'react';
import {Link} from 'react-router-dom';
import {HiChevronDown, HiChevronLeft} from 'react-icons/hi';

export interface CardFooterLink {
  to: string;
  text: string;
}

interface IProps {
  title: string;
  children?: JSX.Element;
  links?: CardFooterLink[];
  isReducible?: boolean;
  isReducedInitially?: boolean;
}

export function BulmaCard({title, children, links, isReducible, isReducedInitially}: IProps): JSX.Element {

  const [isReduced, setIsReduced] = useState(isReducedInitially);

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">{title}</p>
        {isReducible && <button type="button" className="card-header-icon" onClick={() => setIsReduced((value) => !value)}>
          {isReduced ? <HiChevronLeft/> : <HiChevronDown/>}
        </button>}
      </header>
      {(!isReducible || !isReduced) && <div className="card-content">{children}</div>}
      {links && links.length > 0 &&
      <footer className="card-footer">
        {links.map(({to, text}) => <Link key={text} to={to} className="card-footer-item">{text}</Link>)}
      </footer>
      }
    </div>
  );
}