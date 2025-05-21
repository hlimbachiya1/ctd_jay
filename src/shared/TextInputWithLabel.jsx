import styled from 'styled-components';

const StyledLabel = styled.label`
  display: inline-block;
  margin-right: 0.5rem;
  font-weight: 500;
`;

const StyledInput = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0.5rem 0;
`;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
`;

function TextInputWithLabel({ elementId, label, onChange, ref, value }) {
    return (
      <StyledContainer>
        <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
        <StyledInput
          type="text"
          id={elementId}
          ref={ref}
          value={value}
          onChange={onChange}
        />
      </StyledContainer>
    );
  }
  
  export default TextInputWithLabel;