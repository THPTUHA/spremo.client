import {Link} from 'react-router-dom';
import { RawPodcast} from '../../store/types';
import { Helper } from '../../services/Helper';

const _Breadcrumb = ({podcast}: {podcast: RawPodcast}) => {
    return (
        <div className="w-full pt-5 pl-5 sm:pl-10 pr-5 2xl:pr-20 sm:pr-10">
        <ul className="flex items-center uppercase font-medium text-gray-400  text-sm mb-5">
            <li>
                <Link to="/">
                    <a className="hover:text-gray-800 transition-all">
                        Home
                    </a>
                </Link>
            </li>
            <li><span className="mx-1">/</span></li>
            <li>
                <Link to="/podcasts">
                    <a className="hover:text-gray-800 transition-all">
                        Podcast
                    </a>
                </Link>
            </li>
            <li><span className="mx-1">/</span></li>
            <li>
                <Link to={`/podcasts/detail/${podcast.name ? Helper.generateCode(podcast.name + '_' + podcast.sub_name) : "xxxx"}/${podcast.id}`}>
                    <a className="hover:text-gray-800 transition-all">
                        {podcast.name}
                    </a>
                </Link>
            </li>
            <li><span className="mx-1">/</span></li>
            <li>
                <p>Listen</p>
            </li>
        </ul>
    </div>
    )
};


export default _Breadcrumb;