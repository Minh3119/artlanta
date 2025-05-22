import React from "react";
import UserSocialComponent from "./userSocialComponent";
import { toast } from 'react-toastify';
class EditProfileComponent extends React.Component {
    state = {
        user: {
            name: "Ndluong",
            gender: "Male",
            email: "ndluong1903@gmail.com",
            social: [{
                platform: "Github",
                link: "https://github.com/Natlife",
            }],
            bio: "I am a software engineer with a passion for web development.",
        },
    }
    handleOnChangeName = (event) => {
        this.setState({
            user: {
                ...this.state.user,
                name: event.target.value,
            }
        })
    }
    handleOnChangeGender = (event) => {
        this.setState({
            user: {
                ...this.state.user,
                gender: event.target.value,
            }
        })
    }
    handleOnChangeDOB = (event) => {
        if (Date.now() - (new Date(event.target.value).getTime()) >= 18 * 365.25 * 24 * 60 * 60 * 1000) {
            this.setState({
                user: {
                    ...this.state.user,
                    dob: event.target.value,
                }
            })
        }
        else {
            document.getElementsByClassName("DOB")[0].value = "";
            return toast.error('Age must be greater or equal to 18', {
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
        this.setState({
            user: {
                ...this.state.user,
                email: event.target.value,
            }
        })
    }
    handleOnChangeLocation = (event) => {
        this.setState({
            user: {
                ...this.state.user,
                location: event.target.value,
            }
        })
    }
    handleOnChangeBio = (event) => {
        this.setState({
            user: {
                ...this.state.user,
                bio: event.target.value,
            }
        })
    }

    handleAddSocial = (newPlatform, newLink) => {
        this.setState({
            user: {
                ...this.state.user,
                social: [
                    ...this.state.user.social,
                    {
                        platform: newPlatform,
                        link: newLink,
                    }
                ]
            }
        })
    }
    render() {
        if (!this.state.user) {
            return (
                <div className="user-profile-container">
                    <div className="user-profile">Loading...</div>
                </div>
            );
        }
        return (
            <div className="profile-right">
                <div className="profile-header">Edit profile</div>
                <p className="profile-detail-title">Profile photo</p>
                <div className="profile-detail-photo">
                    <img src="../../public/logo192.png" alt="user-logo" />
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
                    <p className="profile-detail-title">Fullname</p>
                    <input type="text" value={this.state.user.name} placeholder="input your fullname"
                        onChange={(event) => this.handleOnChangeName(event)} />
                </div>
                <div className="gender-container">
                    <p className="profile-detail-title">Gender</p>
                    <select value={this.state.user.gender}
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
                    <input type="date" className="DOB" max="" required onChange={(event) => this.handleOnChangeDOB(event)} />
                </div>
                <div className="email-container">
                    <p className="profile-detail-title">Email</p>
                    <input type="text" value={this.state.user.email} placeholder="input your email"
                        onChange={(event) => this.handleOnChangeEmail(event)} />
                </div>
                <UserSocialComponent
                    user={this.state.user}
                    handleAddSocial={this.handleAddSocial}
                />


                <div className="location-container">
                    <p className="profile-detail-title">Location</p>
                    <input type="text" value={this.state.user.location} placeholder="input your location"
                        onChange={(event) => this.handleOnChangeLocation(event)} />
                </div>
                <div className="bio-container">
                    <p className="profile-detail-title">Description</p>
                    <textarea value={this.state.user.bio} onChange={(event) => this.handleOnChangeBio(event)} />
                </div>
                <div className="profile-button">
                    <button type="submit" style={{ backgroundColor: "aqua" }}>Save change</button>
                    <button type="submit" style={{ backgroundColor: "lightcoral" }}>Cancel</button>
                </div>
            </div>
        )
    }
}

export default EditProfileComponent;