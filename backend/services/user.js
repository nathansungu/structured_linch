import Customerror from "../errors/customerror";
import { Customer} from "../models";

//edit profile
const editprofile = async(data)=>{
    const {first_name, second_name, image, email, phone_no } =data
    const userid = req.user.id;

    const updateprofile = await Customer.update({
        data:{first_name, second_name,image, email, phone_no },
        where:{
            userid: userid
        }
    })
    if (!updateprofile){
        Next (new Customerror(400, "Failed to update profile"))
    }
    return{
        message: "profile updated ",
        profile: updateprofile
    }

}
//view profile

const viewprofile = async(data)=> {
    const userid = req.user.id;

    const getprofile = await Customer.findOne({
        where: {userid: userid}
    })
    if(!getprofile){
        Next (new Customerror(400, "Unable to "))
    }
    return{
        message: "profile fetched",
        Profile: getprofile
    }
}
module.exports ={
    viewprofile,
    editprofile,
}