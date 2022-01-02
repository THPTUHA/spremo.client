const Footer = () => {
    return (<>
        <footer className="w-full flex flex-wrap pt-8 py-14 px-5 ">
            <div className="w-1/2 md:w-3/12 mb-3 pr-3">
                <h3 className="font-semibold mb-1.5">WELE</h3>
                <p className=" text-sm">We enjoy learning English</p>
            </div>
            <div className="w-1/2 md:w-3/12 mb-3 pr-3">
                <h3 className="font-semibold mb-1.5">About</h3>
                <ul>
                    <li className=" text-sm"><a href="#">About</a></li>
                    <li className=" text-sm"><a href="#">Get the App</a></li>
                    <li className=" text-sm"><a href="#">Privacy Policy</a></li>
                    <li className=" text-sm"><a href="#">Terms and Conditions</a></li>
                    <li className=" text-sm"><a href="#">Sitemap</a></li>
                </ul>
            </div>
            <div className="w-1/2 md:w-3/12 mb-3 pr-3">
                <h3 className="font-semibold mb-1.5">Follow Us</h3>
                <ul>
                    <li className=" text-sm"><a target={'_blank'} href="https://www.facebook.com/groups/464396007027802">Facebook</a></li>
                    <li className=" text-sm"><a target={'_blank'} href="https://www.facebook.com/groups/464396007027802">Community</a></li>
                    <li className=" text-sm"><a target={'_blank'} href="https://www.facebook.com/welevn">Fanpage</a></li>
                    <li className=" text-sm"><a href="#">Blogs</a></li>
                </ul>
            </div>
            <div className="w-1/2 md:w-3/12 mb-3 pr-3">
                <h3 className="font-semibold mb-1.5">Contact Us</h3>
                <ul>
                    <li className=" text-sm"><a target="_blank" href="https://www.facebook.com/welevn">https://www.facebook.com/welevn</a></li>
                </ul>
            </div>
        </footer>
    </>)
}

export default Footer;