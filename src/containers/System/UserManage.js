import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers } from '../../services/userService';


class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
        };
    }

    async componentDidMount() {
        try {
            let response = await getAllUsers('ALL');
            if (response && response.errCode === 0) {
                this.setState({
                    arrUsers: response.users,
                });
            } else {
                console.error('Lỗi khi lấy danh sách người dùng:', response);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
            // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
        }
    }

    render() {
        return (
            <div className="users-container">
                <h3 className="title text-center">Quản lý người dùng</h3>
                <div className="users-table mt-3 mx-2">
                    <table id="customers">
                        <thead>
                            <tr>
                            <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.arrUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.email}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.address}</td>
                                    <td>
                                        <button className='btn-edit'><i className="fas fa-pencil-alt"></i></button>
                                        <button className='btn-delete'><i className="fas fa-trash"></i></button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
