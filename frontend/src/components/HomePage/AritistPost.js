import userLogo from "../../assets/images/userLogo.svg";
import postImg from "../../assets/images/post-img.svg";
import comment from "../../assets/images/Comment.svg";
import like from "../../assets/images/like.svg";
import save from "../../assets/images/save.svg";
import share from "../../assets/images/share.svg";
import ques from "../../assets/images/question.svg";

export default function ArtistPost() {
  return (
    <div className="row">
      <div className="offset-2 col-8 homepage-post__container">
        <div className="artistpost-container">
          <div className="artistpost-info">
            <img src={userLogo} alt="userLogo"></img>
            <div className="artistpost-user">
              <a href="#!" className="artistpost-user__username">
                fullname
              </a>
              <a href="#!" className="artistpost-user__email">
                @username
              </a>
            </div>
          </div>
          <p className="artistpost-content">Content</p>
          <div className="artistpost-morecontent">
            <img src={postImg} alt="post-img" className="post-img"></img>
            <div className="artistpost-react">
              <div className="artistpost-react__count">
                <div className="artistpost-react__comment">
                  <img src={comment} alt="comment"></img>
                  <p className="comment-count">?</p>
                </div>
                <div className="artistpost-react__like">
                  <img src={like} alt="like"></img>
                  <p className="like-count">?</p>
                </div>
              </div>
              <div className="artistpost-react__uncount">
                <a href="#!">
                  <img src={share} alt="share"></img>
                </a>
                <a href="#!">
                  <img src={save} alt="share"></img>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="artistpost-container">
          <div className="artistpost-info">
            <img src={userLogo} alt="userLogo"></img>
            <div className="artistpost-user">
              <a href="#!" className="artistpost-user__username">
                fullname
              </a>
              <a href="#!" className="artistpost-user__email">
                @username
              </a>
            </div>
          </div>
          <p className="artistpost-content">Content</p>
          <div className="artistpost-morecontent">
            <img
              src="https://th.bing.com/th/id/OIP.IayqZNcSFD0mnRZKtziO8wHaFj?rs=1&pid=ImgDetMain"
              alt="post-img"
              className="post-img"
            ></img>
            <div className="artistpost-react">
              <div className="artistpost-react__count">
                <div className="artistpost-react__comment">
                  <img src={comment} alt="comment"></img>
                  <p className="comment-count">?</p>
                </div>
                <div className="artistpost-react__like">
                  <img src={like} alt="like"></img>
                  <p className="like-count">?</p>
                </div>
              </div>
              <div className="artistpost-react__uncount">
                <a href="#!">
                  <img src={share} alt="share"></img>
                </a>
                <a href="#!">
                  <img src={save} alt="share"></img>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="artistpost-container">
          <div className="artistpost-info">
            <img src={userLogo} alt="userLogo"></img>
            <div className="artistpost-user">
              <a href="#!" className="artistpost-user__username">
                fullname
              </a>
              <a href="#!" className="artistpost-user__email">
                @username
              </a>
            </div>
          </div>
          <p className="artistpost-content">Content</p>
          <div className="artistpost-morecontent">
            <img
              src="data:image/jpeg;base64,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"
              alt="post-img"
              className="post-img"
            ></img>
            <div className="artistpost-react">
              <div className="artistpost-react__count">
                <div className="artistpost-react__comment">
                  <img src={comment} alt="comment"></img>
                  <p className="comment-count">?</p>
                </div>
                <div className="artistpost-react__like">
                  <img src={like} alt="like"></img>
                  <p className="like-count">?</p>
                </div>
              </div>
              <div className="artistpost-react__uncount">
                <a href="#!">
                  <img src={share} alt="share"></img>
                </a>
                <a href="#!">
                  <img src={save} alt="share"></img>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="artistpost-container">
          <div className="artistpost-info">
            <img src={userLogo} alt="userLogo"></img>
            <div className="artistpost-user">
              <a href="#!" className="artistpost-user__username">
                fullname
              </a>
              <a href="#!" className="artistpost-user__email">
                @username
              </a>
            </div>
          </div>
          <p className="artistpost-content">Content</p>
          <div className="artistpost-morecontent">
            <img
              src="https://th.bing.com/th/id/OIP.Jm7wydAw96cQNqe70wBlWAHaFj?w=240&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt="post-img"
              className="post-img"
            ></img>
            <div className="artistpost-react">
              <div className="artistpost-react__count">
                <div className="artistpost-react__comment">
                  <img src={comment} alt="comment"></img>
                  <p className="comment-count">?</p>
                </div>
                <div className="artistpost-react__like">
                  <img src={like} alt="like"></img>
                  <p className="like-count">?</p>
                </div>
              </div>
              <div className="artistpost-react__uncount">
                <a href="#!">
                  <img src={share} alt="share"></img>
                </a>
                <a href="#!">
                  <img src={save} alt="share"></img>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-2 homepage-question__container">
        <div className="homepage-question">
          <a href="#!">
            <img src={ques} alt="quesAi"></img>
          </a>
        </div>
      </div>
    </div>
  );
}
