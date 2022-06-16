import ExploreLayout from "../../components/page/ExploreLayout";

const StaffPick= ()=>{
    return (
        <>
            <ExploreLayout
                user_option={"recommended"} 
                chart_name={'Check out these blogs'}
                blog_list_option={"staff-picks"}
            />
                
        </>
   )
}

export default StaffPick;