import { raw } from "body-parser";
import db from "../models/index";
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise( async(resolve, reject) => {
        try{
            var hashPassword = await bcrypt.hashSync(password, salt);  // hash password
            resolve(hashPassword)
        }catch(e){
            reject(e);
        }
    })
}

let handleUserLogin = (userEmail, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}; // Khởi tạo đối tượng userData để lưu thông tin kết quả đăng nhập
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
// Phương thức compareSync sẽ lấy mật khẩu người dùng nhập vào (password) và so sánh nó với mật khẩu đã được mã hóa trong cơ sở dữ liệu (user.password).
// Nếu hai mật khẩu khớp nhau, compareSync sẽ trả về true.
// Nếu hai mật khẩu không khớp, compareSync sẽ trả về false.
// bcrypt.compareSync(password, user.password): So sánh mật khẩu người dùng nhập vào (password) với mật khẩu đã được mã hóa trong cơ sở dữ liệu (user.password).
                    if (check) {
                        userData.errCode = 0;   // Đăng nhập thành công
                        userData.errMessage = 'OK';

                        delete user.password; // Chỉnh lại để xoá password từ user
                        userData.user = user; // Lưu thông tin người dùng vào userData
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2; // Người dùng không tồn tại trong hệ thống
                    userData.errMessage = "User's not found";
                }
            } else {
                userData.errCode = 1;  // Email không tồn tại trong hệ thống
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
};

let getAllUsers = (userId) => {
    return new Promise( async (resolve, reject) => {
        try{
            let users = '';
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            resolve(users)
        }catch(e){
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise( async(resolve, reject) => {
        try{
            let check = await checkUserEmail(data.email);
            if(check === true){
                resolve({
                    errCode: 1,
                    message: 'Your email is already in used, please try another email'
                })
            }

            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            resolve({
                errCode: 0,
                message: 'OK'
            }); 
        }catch(e){
            reject(e);
        };
    })
}

        let deleteUser = (userId) => {
            return new Promise( async (resolve, reject) => {
                let foundUser = await db.User.findOne({
                    where: { id : userId}
                })
                if(!foundUser){
                    resolve({
                        errCode: 2,
                        errMessage: `The user isn't exist`
                    })
                }

                await db.User.destroy({
                    where: { id : userId}
                })

                resolve({
                    errCode: 0,
                    message: `The user is deleted`
                })
            })
        }

        let updateUserData = (data) => {
            return new Promise( async (resolve, reject) => {
                try{
                    if(!data.id){
                        resolve({
                            errCode: 2,
                            errMessage: 'Missing required parameters'
                        });
                    }
                    let user = await db.User.findOne({
                        where: { id : data.id },
                        raw: false
                    })
                    if(user){
                        user.firstName = data.firstName;
                        user.lastName = data.lastName;
                        user.address = data.address;

                        await user.save();
                        resolve({
                            errCode: 0,
                            message: 'Update the user succeeds!'
                        })
                    }else{
                        resolve({
                            errCode: 1,
                            errMessage: "User's not found!"
                        });
                    }
                }catch(e){
                    reject(e);
                }
            })
        }


module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,

}