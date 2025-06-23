import React from "react";
import search from "../../assets/images/search.svg";
import '../../styles/searchbar.scss';
class SearchBarComponent extends React.Component {
    state = {
        searchValue: "",
        isSearching: false,
        postList: [{

        }]
    }
    componentDidMount() {
        fetch(`http://localhost:9999/backend/api/search/post`, {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch music data');
                return response.json();
            })
            .then(async data => {
                this.setState({
                    postList: data.response,
                });
            })
            .catch(error => {
                console.error('Error fetching music data:', error);
            });
    }
    handleOnChangeSearch = (e) => {
        this.setState({
            searchValue: e.target.value,
            isSearching: true,
        })
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
                                    <div className="search-item" key={item.postID}>
                                        <img className="item-img"
                                            src={item.mediaURL} />
                                        <p className="item-content">{item.content}</p>
                                        <p className="item-author">{item.author}</p>
                                        <p className="item-date">{item.date}</p>
                                    </div>
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