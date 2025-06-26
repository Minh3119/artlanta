import React from "react";
import search from "../../assets/images/search.svg";
import '../../styles/searchbar.scss';
import { toast } from 'react-toastify';
class SearchBarComponent extends React.Component {
    state = {
        searchValue: "",
        isSearching: false,
        postList: [],
        userList: []
    }
    handleOnChangeSearch = async (e) => {
        const newContent = e.target.value;
        if (newContent === "") {
            this.setState({
                searchValue: e.target.value,
                isSearching: false,
                postList: [],
                userList: []
            })
            return
        }

        if (newContent.length > 750) {
                toast.error('Search value too long!', {
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
            });
            return;
        }

        this.setState({
            searchValue: newContent,
            isSearching: true
        });

        // Fetch posts and users in parallel
        try {
            const [postRes, userRes] = await Promise.all([
                fetch(`http://localhost:9999/backend/api/search/post`, {
            method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ searchValue: newContent }),
                    credentials: 'include'
                }),
                fetch(`http://localhost:9999/backend/api/search/user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ searchValue: newContent }),
            credentials: 'include'
        })
            ]);
            let postList = [];
            let userList = [];
            if (postRes.ok) {
                const postData = await postRes.json();
                postList = postData.response || [];
            }
            if (userRes.ok) {
                const userData = await userRes.json();
                userList = userData.response || [];
            }
                this.setState({
                postList,
                userList
                });
        } catch (error) {
            console.error('Error fetching search data:', error);
        }
    }
    render() {
        return (
            <div className="header-search">
                <input
                    type="text"
                    className="header-text-input"
                    placeholder="Seach"
                    value={this.state.searchValue}
                    onChange={(e) => this.handleOnChangeSearch(e)}
                ></input>
                <img src={search} alt="" className="search-icon"></img>
                <div className="search-list">
                    {
                        this.state.isSearching && (this.state.postList.length > 0 || this.state.userList.length > 0) ?
                        <>
                            {this.state.postList.map((item, index) => (
                                <a className="search-item" key={"post-"+item.postID} href={`/post/${item.postID}`}>
                                        <div className="item-img">
                                        <img src={item.image} alt="post" />
                                        </div>
                                        <p className="item-content">{item.content}</p>
                                        <p className="item-author">{item.author}</p>
                                        <p className="item-date">{item.createAt}</p>
                                    </a>
                            ))}
                            {this.state.userList.map((user, index) => (
                                <a className="search-item" key={"user-"+user.id} href={`/user/${user.id}`}>
                                    <div className="item-img">
                                        <img src={user.avatarUrl || search} alt="avatar" />
                                    </div>
                                    <p className="item-content">{user.username}</p>
                                    <p className="item-author">{user.email}</p>
                                    <p className="item-date">User</p>
                                </a>
                            ))}
                        </>
                        : null
                    }
                </div>
            </div>
        )
    }
}
export default SearchBarComponent;