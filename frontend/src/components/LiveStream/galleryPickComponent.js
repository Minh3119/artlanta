import React from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
class GalleryPickComponent extends React.Component {
    state = {
        imageList: []
    }
    async componentDidMount() {
        try {
            const res = await axios.post(
                "http://localhost:9999/backend/api/live/gallery/image/pick",
                {
                    liveID: this.props.ID,
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            const data = res.response;
            this.setState({
                imageList: data
            });
        } catch (err) {
            console.error(err);
        }
    }
    handleAdd = async () => {
        try {
            const res = await axios.post(
                "http://localhost:9999/backend/api/live/gallery/create",
                {
                    liveID: this.props.params.ID,
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );
        } catch (err) {
            console.error(err);
        }
    }
    render() {
        return (
            <div>
                {this.state.imageList.map((item, index) => {
                    <img src={item.imageURL} key={index} onClick={() => this.handleAdd()} />
                })
                }
            </div>
        )
    }
}
export default GalleryPickComponent;