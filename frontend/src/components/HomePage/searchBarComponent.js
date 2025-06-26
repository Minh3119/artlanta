import React from "react";
import search from "../../assets/images/search.svg";
import arlanta from "../../assets/images/arlanta.svg";
import '../../styles/searchbar.scss';
import { toast } from 'react-toastify';
class SearchBarComponent extends React.Component {
    state = {
        searchValue: "",
        isSearching: false,
        postList: [{
            // postID
            // image
            // content
            // author
            // date
            //visibility
        }]
    }
    handleOnChangeSearch = async (e) => {
        const newContent = e.target.value;
        if (newContent === "") {
            this.setState({
                searchValue: e.target.value,
                isSearching: false,
            })
            return
        }

        newContent.length <= 750 ?
            (
                this.setState({
                    searchValue: newContent,
                    isSearching: true
                })
            )
            :
            (
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
                })
            )

        await fetch(`http://localhost:9999/backend/api/search/post`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                searchValue: e.target.value
            }),
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch post data');
                return response.json();
            })
            .then(async data => {
                this.setState({
                    postList: data.response,
                });
            })
            .catch(error => {
                console.error('Error fetching post data:', error);
            });
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
                        this.state.isSearching ?
                            this.state.postList.map((item, index) => {
                                return (
                                    <a className="search-item" key={item.postID} href={`/post/${item.postID}`}>
                                        <div className="item-img">
                                            <img src={item.image == "null" ? arlanta : item.image} />
                                        </div>
                                        <p className="item-content">{item.content}</p>
                                        <p className="item-author">{item.author}</p>
                                        <p className="item-date">{item.createAt}</p>
                                    </a>
                                )
                            })
                            :
                            null
                    }
                </div>

            </div>
        )
    }
}
export default SearchBarComponent;