import React from "react";
import { GrStreetView } from "react-icons/gr";
import { BiSolidTime } from "react-icons/bi";
class LivePageComponent extends React.Component {
    render() {
        return (
            <div className="live-page-container">
                <h1>
                    Live
                </h1>
                <div className="live-post">
                    <div className="user-info">
                        <img alt="user-avatar" />
                        <span className="user-name">User Name</span>
                    </div>
                    <div className="live-post-body">
                        <div className="live-post-content">
                            Content
                        </div>
                        <div className="live-post-stat">
                            <span className="live-post-view"><GrStreetView /> 1000</span>
                            <span className="live-post-time"><BiSolidTime /> 10:00</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default LivePageComponent;