import Head from 'next/head';

const Meta = ({
    title = "WELE",
    keywords = "Learning, English, Free",
    url = "",
    image = "",
    description = "WELE is a community that helping you develop your listening and writing skills"
}: { title?: string, keywords?: string, description?: string, url?: string, image?:string }) => {
    return (
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <link rel="canonical" href={url} />
            <meta name="author" content="Wele" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            <meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            <meta property="og:locale" content="vi_VN" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title ? title : "WeleLearn.com"} />
            <meta property="og:description" content={description ? description : "WELE is a community that helping you develop your listening and writing skills"} />
            <meta property="og:url" content={url ? url : 'https://wele-learn.com/'} />
            <meta property="og:site_name" content="WELE" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image" content={image ? image : "https://wele-learn.com/static/logo.png"} />
            <meta property="og:image:secure_url" content={image ? image : "https://wele-learn.com/static/logo.png"} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:description" content={description ? description : "WELE is a community that helping you develop your listening and writing skills"} />
            <meta name="twitter:title" content={title ? title : "WeleLearn.com"} />
            <meta name="twitter:image" content={image ? image : "https://wele-learn.com/"} />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <meta name='keywords' content={keywords ? keywords : "e-learning, english, free"} />
            <meta name='description' content={description ? description : "WELE is a community that helping you develop your listening and writing skills"} />
            <meta charSet='utf-8' />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <meta name='keywords' content={keywords} />
            <meta name='description' content={description} />
            <meta charSet='utf-8' />
            <link rel='icon' href='/favicon.ico' />
            <title>{title}</title>
        </Head>
    )
}

export default Meta;
