import React from 'react';

const SearchInput = ({ searchTasks }) => {
    return (
        <input
            type="text"
            id="search-tasks"
            placeholder="Search tasks..."
            onChange={searchTasks}
        />
    );
};

export default SearchInput;
