import React, { useState, useEffect} from 'react';

function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString]= useState(queryString);

  useEffect(()=> {
    const debounce = setTimeout(()=> {
      setQueryString(localQueryString);
    }, 500);

    return ()=> clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  const preventRefresh = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label htmlFor="searchInput">Search todos: </label>
        <input
          id="searchInput"
          type="text"
          value = {localQueryString}
          onChange = {(e)=> setLocalQueryString(e.target.value)}
        />
        
        <button type="button" onClick={() => {
          setLocalQueryString(''); 
        }}>
          Clear
        </button>


      </div>

      <div>
        <label htmlFor="sortField">Sort by: </label>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>
      </div>

      <div>
        <label htmlFor="sortDirection">Direction: </label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm;
