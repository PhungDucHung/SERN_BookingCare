import db from "../models/index";
import bcrypt from 'bcryptjs';


let handleUserLogin = (userEmail, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(userEmail); // người dùng nhập đúng với email trong database
            if (isExist) {
                // user already exists
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'], // attributes trong Sequelize tương đương với câu lệnh SELECT trong SQL.
                    where: { email: userEmail }, // Điều kiện tìm kiếm, tìm bản ghi người dùng có email bằng với email đã nhập.
                    raw: true
                });
                if (user) {
                    // compare password
                    let check = bcrypt.compareSync(password, user.password);
// bcrypt.compareSync(password, user.password): So sánh mật khẩu người dùng nhập vào (password) với mật khẩu đã được mã hóa trong cơ sở dữ liệu (user.password).
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';

                        delete user.password; // Chỉnh lại để xoá password từ user
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User's not found";
                }
            } else {
                // return error
                userData.errCode = 1;
                userData.errMessage = "Your Email isn't exist in your system. please try other email!";
            }
            resolve(userData);

        } catch (e) {
            reject(e);
        }
    });
};


let checkUserEmail = (userEmail) => {
    return new Promise( async(resolve, reject) => {
        try{
            let user = await db.User.findOne({ 
                where: { email: userEmail}   
            })
            if(user) {       // user # undefined => true
                resolve(true)
            }else{
                resolve(false)
            }
// { email: userEmail } là điều kiện tìm kiếm, trong đó email là trường trong bảng User và userEmail là giá trị email bạn truyền vào hàm checkUserEmail.
// Điều này có nghĩa là nó sẽ tìm một bản ghi trong bảng User có trường email bằng với giá trị của userEmail.
        }catch(e){
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin
}