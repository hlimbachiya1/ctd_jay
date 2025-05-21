import React, { useState, useEffect} from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 1rem;
  width: 100%;
`;

const StyledFormDiv = styled.div`
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  width: 100%;
  display: flex;
  align-items: center;
`;

const StyledButton = styled.button`
  margin-left: 0.5rem;
`;

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
    <StyledForm onSubmit={preventRefresh}>
      <StyledFormDiv>
        <label htmlFor="searchInput">Search todos: </label>
        <input
          id="searchInput"
          type="text"
          value = {localQueryString}
          onChange = {(e)=> setLocalQueryString(e.target.value)}
        />
        
        <StyledButton type="button" onClick={() => {
          setLocalQueryString(''); 
        }}>
          Clear
        </StyledButton>


      </StyledFormDiv>

      <StyledFormDiv>
        <label htmlFor="sortField">Sort by: </label>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>
      </StyledFormDiv>

      <StyledFormDiv>
        <label htmlFor="sortDirection">Direction: </label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </StyledFormDiv>
    </StyledForm>
  );
}

export default TodosViewForm;
