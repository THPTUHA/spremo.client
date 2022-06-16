import ExploreLayout from "../../components/page/ExploreLayout";

const Recommended= ()=>{
    return (
        <>
            <ExploreLayout
                user_option={"recommended"} 
                chart_name={'Recommended'}
                blog_list_option={"recommended"}
            />
        </>
   )
}

export default Recommended;