import {Link} from 'react-router-dom';

export interface CardFooterLink {
  to: string;
  text: string;
}

interface IProps {
  title: string;
  children?: JSX.Element;
  links?: CardFooterLink[];
}

export function BulmaCard({title, children, links}: IProps): JSX.Element {
  return (
    <div className="card">
      <header className="p-2 rounded-t border border-slate-600">{title}</header>

      {children && <div className="p-2 border-l border-b border-r border-slate-600">{children}</div>}

      {links && links.length > 0 && <footer className="p-2 border-l border-b border-r border-slate-600">
        {links.map(({to, text}) => <Link key={text} to={to} className="text-blue-600">{text}</Link>)}
      </footer>}

    </div>
  );
}
