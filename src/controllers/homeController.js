import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async(req, res) => {
    try{
        let data = await db.User.findAll();
        return res.render('homepage.ejs',{
            data: JSON.stringify(data)
        })
    }catch(e){
        console.log(e)
    }
}


let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async(req, res) => {
    let message = await CRUDService.createNewUser(req.body)
    return res.send('post crud from server');
}

let displayGetCRUD = async(req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('displayCRUD.ejs',{
        // truyền data sang views - nhiều dữ liệu dùng loop
        data: data
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if(userId){
        let userData = await CRUDService.getUserInfoById(userId)
        return res.render('editCRUD.ejs',{
            user: userData
        })
    }
    else{
        return res.send('user not found')
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;  // req.body lấy giá trị input
    let allUsers = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs',{
        // truyền data sang views - nhiều dữ liệu dùng loop
        data: allUsers
    });
}

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    if(userId){
        await CRUDService.deleteUserById(userId);
        return res.send('Delete user succeed')
    }
    else{
        return res.send('User not found');
    }

}

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD : displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}
