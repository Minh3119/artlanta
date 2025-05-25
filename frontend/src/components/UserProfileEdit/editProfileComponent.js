import React from "react";
import UserSocialComponent from "./userSocialComponent";
import { toast } from 'react-toastify';
class EditProfileComponent extends React.Component {
    state = {
        // user: {
        //     logo: '',
        //     fullname: '',
        //     gender: '',
        //     dob: '',
        //     email: '',
        //     social: [],
        //     location: '',
        //     description: ''
        // },
        logo: "",
        username: "",
        fullname: "",
        gender: "",
        dob: "",
        email: "",
        social: [
            {
                platform: "",
                link: ""
            }
        ],
        location: "",
        description: ""
    }
    handleOnChangeUsername = (event) => {
        this.state.username.length <= 50 ?
            (
                this.setState({
                    username: event.target.value
                })
            )
            :
            (
                toast.error('Username too long!', {
                    toastId: "username-toast",
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    className: "toast-complete"
                })
            )
    }
    handleOnChangeFullname = (event) => {
        this.state.username.length <= 100 ?
            (
                this.setState({
                    fullname: event.target.value
                })
            )
            :
            (
                toast.error('Fullname too long!', {
                    toastId: "fullname-toast",
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    className: "toast-complete"
                })
            )
    }
    handleOnChangeGender = (event) => {
        this.setState({
            gender: event.target.value
        })
    }
    handleOnChangeDOB = (event) => {
        if (Date.now() - (new Date(event.target.value).getTime()) >= 18 * 365.25 * 24 * 60 * 60 * 1000) {
            this.setState({
                dob: event.target.value
            })
        }
        else {
            document.getElementsByClassName("DOB")[0].value = "";
            return toast.error('Age must be greater or equal to 18', {
                toastId: "dob-toast",
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                className: "toast-complete"
            });
        }
    }
    handleOnChangeEmail = (event) => {
        (this.state.username.length <= 100) ?
            (
                this.setState({
                    email: event.target.value
                })
            )
            :
            (
                toast.error('Fullname too long!', {
                    toastId: "email-toast",
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    className: "toast-complete"
                })
            )
    }
    handleOnChangeLocation = (event) => {
        this.setState({
            location: event.target.value,
        })
    }
    handleOnChangeBio = (event) => {
        this.setState({
            description: event.target.value,
        })
    }

    handleAddSocial = (newPlatform, newLink) => {
        this.setState({
            social: [
                ...this.state.social,
                {
                    platform: newPlatform,
                    link: newLink,
                }
            ]
        })
    }
    handleSaveChange = () => {

    }

    handleCancel = () => {
        // this.setState({
        //     logo: this.state.user.logo,
        //     fullname: this.state.user.fullname,
        //     gender: this.state.user.gender,
        //     dob: this.state.user.dob,
        //     email: this.state.user.email,
        //     social: [...this.state.user.social],
        //     location: this.state.user.location,
        //     description: this.state.user.description
        // });
        return toast('Cancel edit', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            className: "toast-complete"
        });
    }
    verifyEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.state.email)) {
            document.getElementsByClassName("email-input")[0].style.backgroundColor = "lightgreen";
            toast('Your email is perfect!', {
                toastId: "email-toast",
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                className: "toast-complete"
            });
        }
        else {
            document.getElementsByClassName("email-input")[0].style.backgroundColor = "lightcoral";
            toast.error('Your email is wrong format', {
                toastId: "email-toast",
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                className: "toast-complete"
            });
        }


    }
    componentDidMount = () => {
        fetch('http://localhost:9999/backend/api/user-profile')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch user data');
                return response.json();
            })
            .then(data => {
                this.setState({
                    // user: {
                    //     logo: data.logo || 'https://defaultimage.png',
                    //     fullname: data.fullname || 'Guest',
                    //     gender: data.gender || 'Male',
                    //     dob: data.dob || '',
                    //     email: data.email || '',
                    //     social: Array.isArray(data.social) ? data.social : [],
                    //     location: data.location || '',
                    //     description: data.description || ''
                    // },
                    logo: data.logo || 'https://defaultimage.png',
                    username: data.username || 'Guest',
                    fullname: data.fullname || '',
                    gender: data.gender || 'Male',
                    dob: (new Date(data.dob)).toISOString().split('T')[0],
                    email: data.email || '',
                    social: Array.isArray(data.social) ? data.social : [],
                    location: data.location || '',
                    description: data.description || ''
                });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }
    render() {
        return (
            <div className="profile-right">
                <div className="profile-header">Edit profile</div>
                <p className="profile-detail-title">Profile photo</p>
                <div className="profile-detail-photo">
                    <img src={this.state.logo} alt="user-logo" />
                    <div className="profile-detail-photo-edit">
                        <p className="profile-detail-photo-edit-title">Upload your logo</p>
                        <p className="profile-detail-photo-edit-content">your logo should be jpg or png format</p>
                        <div className="profile-detail-photo-edit-button">
                            <button type="submit">Select image</button>
                            <button type="submit">Remove image</button>
                        </div>
                    </div>
                </div>
                <div className="name-container">
                    <p className="profile-detail-title">Username</p>
                    <input type="text" value={this.state.username} placeholder="input your username"
                        onChange={(event) => this.handleOnChangeUsername(event)} />
                </div>
                <div className="name-container">
                    <p className="profile-detail-title">Fullname</p>
                    <input type="text" value={this.state.fullname} placeholder="input your fullname"
                        onChange={(event) => this.handleOnChangeFullname(event)} />
                </div>
                <div className="gender-container">
                    <p className="profile-detail-title">Gender</p>
                    <select value={this.state.gender}
                        onChange={(event) => this.handleOnChangeGender(event)}>
                        <option value="Male">
                            Male
                        </option>
                        <option value="Female">
                            Female
                        </option>
                        <option value="Other">
                            Other
                        </option>
                    </select>
                </div>
                <div className="dob-container">
                    <p className="profile-detail-title">DOB</p>
                    <input type="date" className="DOB" value={this.state.dob} max="" required onChange={(event) => this.handleOnChangeDOB(event)} />
                </div>
                <div className="email-container">
                    <p className="profile-detail-title">Email</p>
                    <input className="email-input" type="text" value={this.state.email} placeholder="input your email"
                        onChange={(event) => this.handleOnChangeEmail(event)} />
                    <button onClick={() => this.verifyEmail()}>Verify</button>
                </div>


                <UserSocialComponent
                    // user={this.state.user}
                    social={this.state.social}
                    handleAddSocial={this.handleAddSocial}
                />


                <div className="location-container">
                    <p className="profile-detail-title">Location</p>
                    <input type="text" value={this.state.location} placeholder="input your location"
                        onChange={(event) => this.handleOnChangeLocation(event)} />
                </div>
                <div className="bio-container">
                    <p className="profile-detail-title">Description</p>
                    <textarea value={this.state.description} onChange={(event) => this.handleOnChangeBio(event)} />
                </div>
                <div className="profile-button">
                    <button type="submit" style={{ backgroundColor: "aqua" }} onClick={() => this.handleSaveChange()}>Save change</button>
                    <button type="submit" style={{ backgroundColor: "lightcoral" }} onClick={() => this.handleCancel()}>Cancel</button>
                </div>
            </div>
        )
    }
}

export default EditProfileComponent;