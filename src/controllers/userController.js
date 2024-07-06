import userService from "../services/userService";

let handleLogin = async (req, res) => {
    // Lấy email và password từ phần thân của yêu cầu
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        });
    }
    // Gọi hàm handleUserLogin từ userService với email và password
    let userData = await userService.handleUserLogin(email, password);

    // Trả về trạng thái 200 với kết quả của nỗ lực đăng nhập
    return res.status(200).json({
        errCode: userData.errCode, // Mã lỗi từ userService
        message: userData.errMessage, // Thông báo lỗi từ userService
        user: userData.user ? userData.user : {} // Nếu userData.user tồn tại, trả về nó, nếu không trả về một đối tượng rỗng
    });
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;  // All , id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter',
            users: []
        });
    }
    try {
        let users = await userService.getAllUsers(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'Success',
            users: users
        });
    } catch (error) {
        console.error('Error while fetching users:', error);
        return res.status(500).json({
            errCode: 500,
            errMessage: 'Internal server error',
            users: []
        });
    }
};

let handleCreateNewUser = async(req, res) => {
    let message = await userService.createNewUser(req.body);
    console.log(message);
    return res.status(200).json(message);
}

let handleDeleteUser = async(req, res) => {
    if (!req.body.id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter!'
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let handleEditUser = async(req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers:handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
}
