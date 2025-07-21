import React from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import GalleryPickComponent from "./galleryPickComponent";
class LiveGalleryComponent extends React.Component {
    state = {
        currentID: null,
        galleryList: [

        ]
    }
    handleSubmit = async () => {

    }
    render() {
        return (
            <div className="live-gallery-container">
                <div className="gallery-header">
                    <h2>
                        Live Gallery
                    </h2>
                    <button
                        onClick={() => this.handleSubmit()}>
                        +
                    </button>
                    <GalleryPickComponent
                        ID={this.props.ID}
                    />
                </div>
                <div className="gallery-body">
                    {this.state.galleryList.map((item, index) => {
                        return (
                            <div className="gallery-item" key={index}>
                                <div className="item-info">
                                    <p>
                                        {item.Username}
                                    </p>
                                    <p>
                                        {item.Like}
                                    </p>
                                    {this.state.currentID === item.UserID &&
                                        <button>
                                            X
                                        </button>}

                                </div>
                                <img src={item.imageURL} />
                            </div>
                        )
                    }
                    )}
                </div>

            </div>
        )
    }
}
export default LiveGalleryComponent;