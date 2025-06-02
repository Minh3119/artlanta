import ques from "../../assets/images/question.svg";
import postImg from "../../assets/images/post-img.svg";
import userLogo1 from "../../assets/images/user-log.svg";
import userLogo2 from "../../assets/images/user-log1.svg";
import likeComment from "../../assets/images/like-comment.svg";
import replyComment from "../../assets/images/reply-comment.svg";

export default function PostDetailCard() {
  return (
    <div className="row">
      <div className="offset-1 col-10 postcard-container">
        <div className="postcard-img__container">
          <img src={postImg} className="postcard-img"></img>
        </div>
        <div className="postComment-container">
          <div className="comment-user">
            <div className="userComment-logo__container">
                <img
              src={userLogo1}
              alt="your avatar"
              className="userComment-logo"
            ></img>
            </div>
            <form className="comment-form">
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment"
              ></input>
              <button type="submit">Post</button>
            </form>
          </div>
          <div className="comment-container">
            <div className="comment-part">
              <div className="comment-part__container parent">
                <img
                  src={userLogo2}
                  alt="your avatar"
                  className="userComment-logo"
                ></img>
                <div className="comment-content__container">
                    <div className="comment-meta">
                        <p className="comment-user">Ralph Edwards</p>
                         <p className="comment-date">Aug 19, 2021</p>
                    </div>
                    <div className="comment-content__out">
                        <p className="comment-content">
                            So khanh coding UI , he get aura but when i .. win a 20v1 i got -5k aura . Wow i’ll see how it goes . Ngủ đi cậu ơi tối rồi làm TxT
                        </p>
                    </div>
                    <div className="comment-react">
                        <div className="comment-react__like">
                            <img src={likeComment} alt="like"></img>
                            <p className="comment-like">?</p>
                        </div>
                        <div className="comment-react__replies">
                            <img src={replyComment} alt="reply"></img>
                            <p className="comment-like">?</p>
                        </div>
                    </div>
                </div>
              </div>
              <div className="comment-part__container child">
                <img
                  src={userLogo2}
                  alt="your avatar"
                  className="userComment-logo"
                ></img>
                <div className="comment-content__container">
                    <div className="comment-meta">
                        <p className="comment-user">Ralph Edwards</p>
                         <p className="comment-date">Aug 19, 2021</p>
                    </div>
                    <div className="comment-content__out">
                        <p className="comment-content">
                            So khanh coding UI , he get aura but when i .. win a 20v1 i got -5k aura . Wow i’ll see how it goes . Ngủ đi cậu ơi tối rồi làm TxT
                        </p>
                    </div>
                    <div className="comment-react">
                        <div className="comment-react__like">
                            <img src={likeComment} alt="like"></img>
                            <p className="comment-like">?</p>
                        </div>
                        <div className="comment-react__replies">
                            <img src={replyComment} alt="reply"></img>
                            <p className="comment-like">?</p>
                        </div>
                    </div>
                </div>
              </div>
              <div className="comment-part__container child">
                <img
                  src={userLogo2}
                  alt="your avatar"
                  className="userComment-logo"
                ></img>
                <div className="comment-content__container">
                    <div className="comment-meta">
                        <p className="comment-user">Ralph Edwards</p>
                         <p className="comment-date">Aug 19, 2021</p>
                    </div>
                    <div className="comment-content__out">
                        <p className="comment-content">
                            So khanh coding UI , he get aura but when i .. win a 20v1 i got -5k aura . Wow i’ll see how it goes . Ngủ đi cậu ơi tối rồi làm TxT
                        </p>
                    </div>
                    <div className="comment-react">
                        <div className="comment-react__like">
                            <img src={likeComment} alt="like"></img>
                            <p className="comment-like">?</p>
                        </div>
                        <div className="comment-react__replies">
                            <img src={replyComment} alt="reply"></img>
                            <p className="comment-like">?</p>
                        </div>
                    </div>
                </div>
              </div>
              <div className="comment-part__container child">
                <img
                  src={userLogo2}
                  alt="your avatar"
                  className="userComment-logo"
                ></img>
                <div className="comment-content__container">
                    <div className="comment-meta">
                        <p className="comment-user">Ralph Edwards</p>
                         <p className="comment-date">Aug 19, 2021</p>
                    </div>
                    <div className="comment-content__out">
                        <p className="comment-content">
                            So khanh coding UI , he get aura but when i .. win a 20v1 i got -5k aura . Wow i’ll see how it goes . Ngủ đi cậu ơi tối rồi làm TxT
                        </p>
                    </div>
                    <div className="comment-react">
                        <div className="comment-react__like">
                            <img src={likeComment} alt="like"></img>
                            <p className="comment-like">?</p>
                        </div>
                        <div className="comment-react__replies">
                            <img src={replyComment} alt="reply"></img>
                            <p className="comment-like">?</p>
                        </div>
                    </div>
                </div>
              </div>
              <div className="comment-part__container child">
                <img
                  src={userLogo2}
                  alt="your avatar"
                  className="userComment-logo"
                ></img>
                <div className="comment-content__container">
                    <div className="comment-meta">
                        <p className="comment-user">Ralph Edwards</p>
                         <p className="comment-date">Aug 19, 2021</p>
                    </div>
                    <div className="comment-content__out">
                        <p className="comment-content">
                            So khanh coding UI , he get aura but when i .. win a 20v1 i got -5k aura . Wow i’ll see how it goes . Ngủ đi cậu ơi tối rồi làm TxT
                        </p>
                    </div>
                    <div className="comment-react">
                        <div className="comment-react__like">
                            <img src={likeComment} alt="like"></img>
                            <p className="comment-like">?</p>
                        </div>
                        <div className="comment-react__replies">
                            <img src={replyComment} alt="reply"></img>
                            <p className="comment-like">?</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="comment-part">
              <div className="comment-part__container parent">
                <img
                  src={userLogo2}
                  alt="your avatar"
                  className="userComment-logo"
                ></img>
                <div className="comment-content__container">
                    <div className="comment-meta">
                        <p className="comment-user">Ralph Edwards</p>
                         <p className="comment-date">Aug 19, 2021</p>
                    </div>
                    <div className="comment-content__out">
                        <p className="comment-content">
                            So khanh coding UI , he get aura but when i .. win a 20v1 i got -5k aura . Wow i’ll see how it goes . Ngủ đi cậu ơi tối rồi làm TxT
                        </p>
                    </div>
                    <div className="comment-react">
                        <div className="comment-react__like">
                            <img src={likeComment} alt="like"></img>
                            <p className="comment-like">?</p>
                        </div>
                        <div className="comment-react__replies">
                            <img src={replyComment} alt="reply"></img>
                            <p className="comment-like">?</p>
                        </div>
                    </div>
                </div>
              </div>
              <div className="comment-part__container child">
                <img
                  src={userLogo2}
                  alt="your avatar"
                  className="userComment-logo"
                ></img>
                <div className="comment-content__container">
                    <div className="comment-meta">
                        <p className="comment-user">Ralph Edwards</p>
                         <p className="comment-date">Aug 19, 2021</p>
                    </div>
                    <div className="comment-content__out">
                        <p className="comment-content">
                            So khanh coding UI , he get aura but when i .. win a 20v1 i got -5k aura . Wow i’ll see how it goes . Ngủ đi cậu ơi tối rồi làm TxT
                        </p>
                    </div>
                    <div className="comment-react">
                        <div className="comment-react__like">
                            <img src={likeComment} alt="like"></img>
                            <p className="comment-like">?</p>
                        </div>
                        <div className="comment-react__replies">
                            <img src={replyComment} alt="reply"></img>
                            <p className="comment-like">?</p>
                        </div>
                    </div>
                </div>
              </div>
              <div className="comment-part__container child">
                <img
                  src={userLogo2}
                  alt="your avatar"
                  className="userComment-logo"
                ></img>
                <div className="comment-content__container">
                    <div className="comment-meta">
                        <p className="comment-user">Ralph Edwards</p>
                         <p className="comment-date">Aug 19, 2021</p>
                    </div>
                    <div className="comment-content__out">
                        <p className="comment-content">
                            So khanh coding UI , he get aura but when i .. win a 20v1 i got -5k aura . Wow i’ll see how it goes . Ngủ đi cậu ơi tối rồi làm TxT
                        </p>
                    </div>
                    <div className="comment-react">
                        <div className="comment-react__like">
                            <img src={likeComment} alt="like"></img>
                            <p className="comment-like">?</p>
                        </div>
                        <div className="comment-react__replies">
                            <img src={replyComment} alt="reply"></img>
                            <p className="comment-like">?</p>
                        </div>
                    </div>
                </div>
              </div>
              <div className="comment-part__container child">
                <img
                  src={userLogo2}
                  alt="your avatar"
                  className="userComment-logo"
                ></img>
                <div className="comment-content__container">
                    <div className="comment-meta">
                        <p className="comment-user">Ralph Edwards</p>
                         <p className="comment-date">Aug 19, 2021</p>
                    </div>
                    <div className="comment-content__out">
                        <p className="comment-content">
                            So khanh coding UI , he get aura but when i .. win a 20v1 i got -5k aura . Wow i’ll see how it goes . Ngủ đi cậu ơi tối rồi làm TxT
                        </p>
                    </div>
                    <div className="comment-react">
                        <div className="comment-react__like">
                            <img src={likeComment} alt="like"></img>
                            <p className="comment-like">?</p>
                        </div>
                        <div className="comment-react__replies">
                            <img src={replyComment} alt="reply"></img>
                            <p className="comment-like">?</p>
                        </div>
                    </div>
                </div>
              </div>
              <div className="comment-part__container child">
                <img
                  src={userLogo2}
                  alt="your avatar"
                  className="userComment-logo"
                ></img>
                <div className="comment-content__container">
                    <div className="comment-meta">
                        <p className="comment-user">Ralph Edwards</p>
                         <p className="comment-date">Aug 19, 2021</p>
                    </div>
                    <div className="comment-content__out">
                        <p className="comment-content">
                            So khanh coding UI , he get aura but when i .. win a 20v1 i got -5k aura . Wow i’ll see how it goes . Ngủ đi cậu ơi tối rồi làm TxT
                        </p>
                    </div>
                    <div className="comment-react">
                        <div className="comment-react__like">
                            <img src={likeComment} alt="like"></img>
                            <p className="comment-like">?</p>
                        </div>
                        <div className="comment-react__replies">
                            <img src={replyComment} alt="reply"></img>
                            <p className="comment-like">?</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-1 homepage-question__container">
        <div className="homepage-question">
          <a href="#!">
            <img src={ques} alt="quesAi" />
          </a>
        </div>
      </div>
    </div>
  );
}
