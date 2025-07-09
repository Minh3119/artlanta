import React from "react";
import { GrStreetView } from "react-icons/gr";
import { BiSolidTime } from "react-icons/bi";
class LivePageComponent extends React.Component {
    state = {
        LiveList: [
            {
                ID: '1',
                userID: 'user1',
                UserName: 'User One',
                avatar: 'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/508555249_1351964862567100_4775044599654130702_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=CjI3ppMRw2MQ7kNvwGlH58Z&_nc_oc=Adn0nj78tAZHa3fAqq3sW6FZ10fniUZyIu7m-W03ooXzwq6F4a6S8xmivNrRN9T7_Qk&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=COK1ETjFaDTwFgBIA8kmZQ&oh=00_AfT0wgEJS9Vc8Cft6gmPqlnpCoeq8hNj5BSY9-VzNKXUHg&oe=6872B17C',
                title: 'Live Stream 1',
                LiveView: 1000,
                CreatedAt: '19/03/2025',
                Visibility: 'Public',
                LiveStatus: 'Live',
                //id
                //userID
                //UserName
                //avatar
                //title
                //View
                //CreatedAt
                //LiveStatus
                //Visivility
            }
        ],
    }
    componentDidMount() {
        fetch(`http://localhost:9999/backend/api/live`, {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch data');
                return response.json();
            })
            .then(async data => {
                // const response = await fetch(item.mediaURL);
                // const blob = await response.blob();
                // const avt = new File([blob], `image_${index}`, { type: blob.type });
                this.setState({
                    // ID: data.response.ID,
                    // UserID: data.response.UserID,
                    // UserName: data.response.UserName,
                    // Avatar: data.response.Avatar,
                    // Title: data.response.Title,
                    // View: data.response.View,
                    // CreatedAt: data.response.CreatedAt,
                    // LiveStatus: data.response.LiveStatus,
                    // Visibility: data.response.Visibility,
                    LiveList: data.response,

                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    componentDidUpdate() {
        fetch(`http://localhost:9999/backend/api/`, {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch data');
                return response.json();
            })
            .then(async data => {
                this.setState({
                    LiveList: data.response,

                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    render() {
        return (
            <div className="live-page-container">
                <h1>
                    Live
                </h1>
                {
                    this.state.LiveList.map((item, index) => {
                        return (
                            <div className="live-post" style={{ border: item.liveStatus === "Live" ? '5px solid Red' : '3px solid aqua' }}>
                                <div className="user-info">
                                    <img src={item.avatar} alt="user-avatar" />
                                    <span className="user-name">{item.userName}</span>
                                </div>
                                <div className="live-post-body">
                                    <div className="live-post-content">
                                        {item.title}
                                    </div>
                                    <div className="live-post-stat">
                                        <span className="live-post-view"><GrStreetView /> {item.view}</span>
                                        <span className="live-post-time"><BiSolidTime /> {item.createdAt}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }



            </div >
        )
    }
}
export default LivePageComponent;