import ExploreLayout from "../../components/page/ExploreLayout";

const Trending= ()=>{
   return (
        <>
            <ExploreLayout
                 user_option={"top"} 
                 chart_name={'Top users'}
                 blog_list_option={"trending"}
            />
        </>
   )
}

export default Trending;