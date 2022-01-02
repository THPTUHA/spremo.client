import  { ReactElement } from 'react';
import { useLocation ,Link} from 'react-router-dom';

interface Props {
    href: string,
    bg_active_class?: string,
    text_active_class?: string,
    hover_active_class?: string,
    children: ReactElement
}

const AutoActiveLink = ({ children, href, bg_active_class, text_active_class, hover_active_class }: Props) => {
    // const { asPath } = useRouter()
    const location = useLocation();
    return (
        <li className={` mb-1`}>
            <Link to={href}>
                <a className={` 
            ${location.pathname === href ? `${bg_active_class ? bg_active_class : "bg-primary-light"} ${text_active_class ? text_active_class : "text-primary"}` : ' text-gray-500 '}
            flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${hover_active_class ? hover_active_class : "hover:text-primary-dark"} transition-all`}>
                    {children}
                </a>

            </Link>
        </li>
    );
};

export default AutoActiveLink;
