import React from "react";
class LiveGalleryComponent extends React.Component {
    state = {
        currentID: null,
        galleryList: [

        ]
    }
    render() {
        return (
            <div className="live-gallery-container">
                <div className="gallery-header">
                    <h2>
                        Live Gallery
                    </h2>
                    <button>
                        X
                    </button>
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